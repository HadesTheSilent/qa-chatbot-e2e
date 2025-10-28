Chatbot SUT — Frontend

Single-page app em React (Vite) que conversa com o chatbot.

Uso rápido
1. `cd chatbot-sut/frontend`
2. `npm install`
3. `npm run dev`

Configuração
- O cliente chama o backend em `http://localhost:4000/api/message`.
- Para outro host, defina `VITE_API_URL` antes de `npm run dev` ou na build do Docker.

Notas rápidas
- Interface simples para demonstrar os testes E2E em funcionamento.
- Layout responsivo (desktop/mobile) focado em clareza de fluxo.
