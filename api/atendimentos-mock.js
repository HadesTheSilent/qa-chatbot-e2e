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
  // or '/:id' for /api/atendimentos-mock/:id or '/atendimentos' or '/atendimentos/:id'
  const url = (req.url || '').replace(/\/+$/,'');
  const segments = url.split('/').filter(Boolean); // ['atendimentos','123'] or ['123'] or []
  let id = null;
  if (segments.length === 1 && /^\d+$/.test(segments[0])) {
    id = segments[0];
  } else if (segments.length === 2 && segments[0] === 'atendimentos' && /^\d+$/.test(segments[1])) {
    id = segments[1];
  }

  // Create (accept both / and /atendimentos)
  if (req.method === 'POST' && (segments.length === 0 || (segments.length === 1 && segments[0] === 'atendimentos'))) {
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

  // Get by id (accept /:id or /atendimentos/:id)
  if (req.method === 'GET' && id) {
    const row = store.get(id);
    if (!row) return res.status(404).json({ error: 'não encontrado (mock)' });
    return res.json(row);
  }

  // Update status (accept /:id or /atendimentos/:id)
  if (req.method === 'PUT' && id) {
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
