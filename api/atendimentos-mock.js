// Minimal mock Atendimentos API for demo usage on Vercel
// This mock does NOT store full PII. It stores only the last 4 digits of contact.
let nextId = 1;
const store = new Map();

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // req.url for Vercel serverless will be '' for /api/atendimentos-mock
  // or '/:id' for /api/atendimentos-mock/:id
  const url = req.url || '';
  const idMatch = url.match(/^\/(\d+)/);

  // Create
  if (req.method === 'POST' && (url === '' || url === '/')) {
    const { nome, contato, status = 'open' } = req.body || {};
    if (!nome) return res.status(400).json({ error: 'nome é obrigatório (mock)' });

    const id = nextId++;
    const last4 = contato ? String(contato).slice(-4) : null;
    const row = {
      id,
      nome,
      contato_last4: last4,
      status,
      created_at: new Date().toISOString(),
    };
    store.set(String(id), row);
    return res.status(201).json(row);
  }

  // Get by id
  if (req.method === 'GET' && idMatch) {
    const id = idMatch[1];
    const row = store.get(id);
    if (!row) return res.status(404).json({ error: 'não encontrado (mock)' });
    return res.json(row);
  }

  // Update status
  if (req.method === 'PUT' && idMatch) {
    const id = idMatch[1];
    const row = store.get(id);
    if (!row) return res.status(404).json({ error: 'não encontrado (mock)' });
    const { status } = req.body || {};
    if (!status) return res.status(400).json({ error: 'status é obrigatório' });
    row.status = status;
    store.set(id, row);
    return res.json(row);
  }

  res.status(404).json({ error: 'not found' });
};
