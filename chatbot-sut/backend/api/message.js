const cors = require('cors');

const defaultApiHost = process.env.NODE_ENV === 'production'
  ? '/api/atendimentos-mock' // demo: use local mock on Vercel for safe public demo
  : 'http://localhost:5000';

const atendimentosApi = process.env.ATENDIMENTOS_API_URL || defaultApiHost;

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

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Falha ao atualizar atendimento (${response.status}): ${body}`);
  }

  return `NeonBot: Atendimento #${id} atualizado para ${status}.`;
}

async function processarMensagem(mensagem) {
  const text = sanitize(mensagem).toLowerCase();

  // Comando para abrir atendimento
  const aberturaMatch = text.match(/abrir?\s+atendimento\s+(?:para\s+)?(\w+)(?:\s+contato\s+(\w+))?/i);
  if (aberturaMatch) {
    const [, nome, contato] = aberturaMatch;
    return await abrirAtendimento({
      nome: nome || 'Anônimo',
      contato: contato || 'não informado',
      status: 'open',
    });
  }

  // Comando para consultar atendimento
  const consultaMatch = text.match(/(?:consultar?|ver|obter)\s+(?:o\s+)?(?:atendimento|status)\s+#?(\d+)/i);
  if (consultaMatch) {
    const [, id] = consultaMatch;
    return await obterAtendimento(id);
  }

  // Comando para fechar atendimento
  const fechamentoMatch = text.match(/(?:fechar?|encerrar?)\s+(?:o\s+)?atendimento\s+#?(\d+)/i);
  if (fechamentoMatch) {
    const [, id] = fechamentoMatch;
    return await atualizarStatusAtendimento(id, 'closed');
  }

  // Respostas padrão
  if (text.includes('oi') || text.includes('ola') || text.includes('hello')) {
    return 'NeonBot: Olá! Sou o assistente virtual. Posso ajudar com atendimentos. Digite "abrir atendimento para [nome]" para começar.';
  }

  if (text.includes('ajuda') || text.includes('help')) {
    return 'NeonBot: Comandos disponíveis:\n• "abrir atendimento para [nome] contato [telefone]"\n• "consultar atendimento [número]"\n• "fechar atendimento [número]"';
  }

  return 'NeonBot: Não entendi. Digite "ajuda" para ver os comandos disponíveis.';
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const reply = await processarMensagem(message);
    res.status(200).json({ reply });

  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({
      reply: 'NeonBot: Desculpe, ocorreu um erro interno. Tente novamente mais tarde.'
    });
  }
};