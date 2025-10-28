const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const defaultApiHost = process.env.NODE_ENV === 'production' ? 'http://atendimentos-api:5000' : 'http://localhost:5000';
const atendimentosApi = process.env.ATENDIMENTOS_API_URL || defaultApiHost;

// Endpoint de saúde
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const sanitize = (text) => String(text).slice(0, 200);

async function abrirAtendimento(payload) {
  const response = await fetch(`${atendimentosApi}/atendimentos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Falha ao criar atendimento (${response.status}): ${body}`);
  }

  const data = await response.json();
  return `NeonBot: Atendimento #${data.id} criado para ${data.nome} (${data.status}).`;
}

async function obterAtendimento(id) {
  const response = await fetch(`${atendimentosApi}/atendimentos/${id}`);
  if (response.status === 404) {
    return `NeonBot: Não achei atendimento #${id}.`;  
  }
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Falha ao consultar atendimento (${response.status}): ${body}`);
  }

  const data = await response.json();
  return `NeonBot: Atendimento #${data.id} está com status ${data.status} (responsável ${data.nome}).`;
}

async function atualizarStatusAtendimento(id, status) {
  const response = await fetch(`${atendimentosApi}/atendimentos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });

  if (response.status === 404) {
    return `NeonBot: Não encontrei atendimento #${id} para atualizar.`;
  }
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Falha ao atualizar atendimento (${response.status}): ${body}`);
  }

  const data = await response.json();
  return `NeonBot: Atendimento #${data.id} agora está ${data.status}.`;
}

function parseAbrir(message) {
  // Aceita formatos: "abrir atendimento nome=João contato=123" ou "abrir atendimento João 123"
  const matchComIgual = message.match(/^abrir atendimento\s+nome\s*=\s*(?<nome>[^,]+)\s+contato\s*=\s*(?<contato>.+)$/i);
  const matchSemIgual = message.match(/^abrir atendimento\s+(?<nome>[^0-9]+?)\s+(?<contato>\d+)$/i);
  const match = matchComIgual || matchSemIgual;
  if (!match) return null;

  const nome = match.groups.nome.trim();
  const contato = match.groups.contato.trim();
  
  // Valida nome (apenas letras e espaços)
  if (!nome.match(/^[A-Za-zÀ-ÿ\s]+$/)) return null;
  
  // Valida contato (apenas números)
  if (!contato.match(/^\d+$/)) return null;

  return { nome, contato };
}

function parseStatus(message) {
  const match = message.match(/^(status|consultar) atendimento\s+(?<id>\d+)$/i);
  return match ? Number(match.groups.id) : null;
}

function parseFechar(message) {
  const match = message.match(/^(fechar|encerrar) atendimento\s+(?<id>\d+)$/i);
  return match ? Number(match.groups.id) : null;
}

async function responder(message) {
  const trimmed = message.trim();

  const abrirPayload = parseAbrir(trimmed);
  if (abrirPayload) {
    return abrirAtendimento(abrirPayload);
  }
  if (/^abrir atendimento/i.test(trimmed)) {
    return 'NeonBot: Use "abrir atendimento João 11999999999" ou "abrir atendimento nome=João contato=11999999999". O nome deve conter apenas letras e o contato apenas números.';
  }

  const statusId = parseStatus(trimmed);
  if (statusId) {
    return obterAtendimento(statusId);
  }
  if (/^(status|consultar) atendimento/i.test(trimmed)) {
    return 'NeonBot: Consulte assim -> "status atendimento 42".';
  }

  const fecharId = parseFechar(trimmed);
  if (fecharId) {
    return atualizarStatusAtendimento(fecharId, 'closed');
  }
  if (/^(fechar|encerrar) atendimento/i.test(trimmed)) {
    return 'NeonBot: Para fechar informe o id, ex: "fechar atendimento 42".';
  }

  return `NeonBot: Recebi sua mensagem -> "${sanitize(message)}"`;
}

// Endpoint do bot com integração aos atendimentos
app.post('/api/message', async (req, res) => {
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: 'mensagem é obrigatória' });

  try {
    const reply = await responder(message);
    res.json({ reply });
  } catch (err) {
    console.error('Erro ao processar mensagem:', err);
    res.json({ reply: 'NeonBot: Tive um problema ao falar com a API de atendimentos.' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Backend do chatbot ouvindo na porta ${port}`));
