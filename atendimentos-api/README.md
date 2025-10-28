API de Atendimentos

API Express simples para gerenciar atendimentos (tickets).

Endpoints:
- POST /atendimentos - body { nome, contato, status? } -> cria atendimento
- GET /atendimentos/:id - retorna atendimento
- PUT /atendimentos/:id - body { status } -> atualiza status

Como executar:
1. cd atendimentos-api
2. npm install
3. npm test  # executa o suite de testes Supertest/Jest
4. npm start # inicia servidor na porta 5000

Notas:
- Usa sqlite3 com arquivo 'data.sqlite' criado na pasta.
- Testes removem arquivo de banco existente para manter testes idempotentes.
