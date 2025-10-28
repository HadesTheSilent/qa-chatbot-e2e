docker compose build
docker compose up
QA Chatbot E2E Workspace

Este repositório demonstra, de ponta a ponta, um chatbot testável que serve como vitrine de trabalho.

Execução com Docker Compose (rápido)
- `docker compose up --build`
- Frontend: http://localhost
- Chatbot backend: http://localhost:4000
- API de atendimentos: http://localhost:5000
- Para customizar endpoints: ajuste `VITE_API_URL` (frontend build arg) e `ATENDIMENTOS_API_URL` (env do backend)

Comandos úteis do chatbot
- `abrir atendimento nome=Fulana contato=12345`
- `status atendimento 42`
- `fechar atendimento 42`

Componentes principais
- `chatbot-sut/backend`: API Node.js/Express que responde mensagens e integra com a API de atendimentos.
- `chatbot-sut/frontend`: SPA React (Vite) que apresenta o chat.
- `chatbot-sut/cypress`: Cenários BDD (Cucumber) que automatizam o fluxo do usuário final.
- `atendimentos-api`: Serviço de tickets (Express + SQLite/Postgres) com testes Supertest e coleção Postman.

Como executar localmente (PowerShell)
1. `cd chatbot-sut/backend; npm install; npm start`
   - Ajuste `ATENDIMENTOS_API_URL` se a API de tickets estiver em outro host (padrão `http://localhost:5000`).
2. `cd atendimentos-api; npm install; npm start`
3. `cd chatbot-sut/frontend; npm install; npm run dev`
   - Para apontar o frontend a outro backend use `VITE_API_URL`.
4. Abra `http://localhost:5173` e valide o fluxo do chat.

Testes automatizados
- Chatbot (Cypress): `cd chatbot-sut; npm run test`
  - Com os serviços rodando via Docker, defina `$env:CYPRESS_BASE_URL = "http://localhost"` antes do comando.
- API de atendimentos: `cd atendimentos-api; npm test`
- Coleção Postman/Newman: `cd atendimentos-api; npm run test:postman`
 

Sobre a arquitetura
- A API do chatbot valida mensagens, delega ao serviço de atendimentos e mantém respostas padronizadas com o prefixo “NeonBot”.
- O serviço de atendimentos roda com SQLite por padrão e alterna para Postgres ao definir `DB_TYPE=postgres` (usado no Compose).
- Os testes BDD cobrem abertura, consulta e fechamento de tickets e funcionam tanto contra o dev server quanto via Docker Compose.

Este material foi montado para apresentações rápidas: suba os serviços, rode os testes automatizados e demonstre o fluxo completo em poucos minutos.
