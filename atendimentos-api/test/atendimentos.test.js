const request = require('supertest');
const fs = require('fs');
const path = require('path');

// Garantir DB fresco para testes removendo arquivo se existir
const dbFile = path.join(__dirname, '..', 'data.sqlite');
if (fs.existsSync(dbFile)) fs.unlinkSync(dbFile);

const app = require('..');

describe('API de Atendimentos', () => {
  let criado;

  test('POST /atendimentos - criar atendimento', async () => {
    const payload = { nome: 'João', contato: 'joao@example.com' };
    const res = await request(app).post('/atendimentos').send(payload).expect(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.nome).toBe(payload.nome);
    expect(res.body.contato).toBe(payload.contato);
    expect(res.body.status).toBe('open');
    criado = res.body;
  });

  test('GET /atendimentos/:id - buscar atendimento', async () => {
    const res = await request(app).get(`/atendimentos/${criado.id}`).expect(200);
    expect(res.body.id).toBe(criado.id);
    expect(res.body).toHaveProperty('created_at');
  });

  test('PUT /atendimentos/:id - atualizar status', async () => {
    const res = await request(app).put(`/atendimentos/${criado.id}`).send({ status: 'closed' }).expect(200);
    expect(res.body.status).toBe('closed');
  });

  test('Contrato: respostas têm formato esperado', async () => {
    const res = await request(app).get(`/atendimentos/${criado.id}`).expect(200);
    const expectedKeys = ['id', 'nome', 'contato', 'status', 'created_at'];
    expectedKeys.forEach(k => expect(Object.keys(res.body)).toContain(k));
  });
});
