# Observação sobre deploy no Vercel

Este projeto inclui um frontend estático adequado para deploy no Vercel.

Importante: a configuração do Vercel neste repositório destina‑se apenas a hospedar o frontend para visualização/demo. As APIs de backend (serviços Express, SQLite/Postgres ou serviços em Docker) não são garantidas para execução como funções serverless no Vercel e podem exigir hospedagem externa ou uma estratégia de deploy diferente.

Recomendações:
- Use o Vercel apenas para servir o build do frontend (`chatbot-sut/frontend`) para previews públicos.
- Para desenvolvimento local e testes E2E, execute os serviços de backend localmente (veja `chatbot-sut/backend` e `atendimentos-api`) ou utilize o mock incluído (`api/atendimentos-mock.js`).
- Se precisar de um backend pronto para produção, hospede-o em uma plataforma que suporte serviços persistentes (containers ou bancos gerenciados) e configure as variáveis de ambiente apropriadas no deploy.

Esta nota foi adicionada após reverter mudanças experimentais no Vercel que tentavam hospedar endpoints de backend como serverless. A configuração original do Vercel permanece focada no frontend e no handler `/api/message` usado pela demo.
