const express = require('express');
const db = require('./db');
const Joi = require('joi');
const app = express();
app.use(express.json());

const atendimentoSchema = Joi.object({
  id: Joi.number().integer().required(),
  nome: Joi.string().required(),
  contato: Joi.string().required(),
  status: Joi.string().valid('open', 'closed').required(),
  created_at: Joi.date().required()
});

const isPostgres = process.env.DB_TYPE === 'postgres';

// Helper for queries
const runQuery = (query, params = []) => {
  if (isPostgres) {
    return db.query(query, params);
  } else {
    return new Promise((resolve, reject) => {
      db.run(query, params, function (err) {
        if (err) reject(err);
        else resolve(this);
      });
    });
  }
};

const getQuery = (query, params = []) => {
  if (isPostgres) {
    return db.query(query, params).then(res => res.rows[0]);
  } else {
    return new Promise((resolve, reject) => {
      db.get(query, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
};

// Cria atendimento
app.post('/atendimentos', async (req, res) => {
  const { nome, contato, status = 'open' } = req.body || {};
  if (!nome || !contato) return res.status(400).json({ error: 'nome e contato são obrigatórios' });

  try {
    const insertSql = isPostgres
      ? 'INSERT INTO atendimentos (nome, contato, status) VALUES ($1, $2, $3) RETURNING *'
      : 'INSERT INTO atendimentos (nome, contato, status) VALUES ($1, $2, $3)';
    const result = await runQuery(insertSql, [nome, contato, status]);

    let row;
    if (isPostgres) {
      row = result.rows[0];
    } else {
      const id = result.lastID;
      row = await getQuery('SELECT * FROM atendimentos WHERE id = $1', [id]);
    }

    const { error } = atendimentoSchema.validate(row);
    if (error) return res.status(500).json({ error: 'schema validation failed' });
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ error: 'db error' });
  }
});

// Obter por id
app.get('/atendimentos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const row = await getQuery('SELECT * FROM atendimentos WHERE id = $1', [id]);
    if (!row) return res.status(404).json({ error: 'não encontrado' });
    const { error } = atendimentoSchema.validate(row);
    if (error) return res.status(500).json({ error: 'falha na validação de schema' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: 'erro de banco' });
  }
});

// Atualizar status
app.put('/atendimentos/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};
  if (!status) return res.status(400).json({ error: 'status é obrigatório' });
  try {
    const result = await runQuery('UPDATE atendimentos SET status = $1 WHERE id = $2', [status, id]);
    if (isPostgres ? result.rowCount === 0 : result.changes === 0) return res.status(404).json({ error: 'não encontrado' });
    const row = await getQuery('SELECT * FROM atendimentos WHERE id = $1', [id]);
    const { error } = atendimentoSchema.validate(row);
    if (error) return res.status(500).json({ error: 'falha na validação de schema' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: 'erro de banco' });
  }
});

if (require.main === module) {
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`API de Atendimentos ouvindo na porta ${port}`));
}

module.exports = app;
