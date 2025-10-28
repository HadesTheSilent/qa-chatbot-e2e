# 👩‍💻 Guia de Desenvolvimento

## Ambiente de Desenvolvimento

### Requisitos
- Node.js 18+
- Docker e Docker Compose
- Git
- VS Code (recomendado)

### Extensões VS Code Recomendadas
- ESLint
- Prettier
- Docker
- REST Client
- Jest Runner
- Cucumber (Gherkin)

## Estrutura do Projeto

```
qa-chatbot-e2e/
├── .github/              # GitHub Actions
├── chatbot-sut/         
│   ├── backend/         # API do chatbot
│   ├── frontend/        # Interface React
│   └── cypress/         # Testes E2E
├── atendimentos-api/    # API de tickets
└── docs/               # Documentação
```

## Padrões de Código

### Commits
Seguimos o Conventional Commits:
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `chore`: Manutenção
- `test`: Testes
- `refactor`: Refatoração

### Estilo de Código
- ESLint com Airbnb Style Guide
- Prettier para formatação
- TypeScript para tipagem

## Fluxo de Desenvolvimento

1. Clone o repositório
2. Crie uma branch: `feature/nome-da-feature`
3. Desenvolva e teste localmente
4. Faça commit seguindo convenções
5. Push e crie Pull Request
6. Aguarde review e CI

## Dicas de Debug

### Backend
```bash
# Modo debug
cd chatbot-sut/backend
npm run debug

# Logs detalhados
DEBUG=* npm start
```

### Frontend
```bash
# Modo desenvolvimento
cd chatbot-sut/frontend
npm run dev

# Análise de bundle
npm run analyze
```

### API de Atendimentos
```bash
# Logs SQL
DEBUG=knex:* npm start

# Migrations
npm run migrate
```

## Docker em Desenvolvimento

### Compose Override
Use `docker-compose.override.yml`:
```yaml
services:
  frontend:
    volumes:
      - ./chatbot-sut/frontend:/app
    command: npm run dev
```

### Logs em Tempo Real
```bash
docker compose logs -f service-name
```

## Troubleshooting Comum

### Frontend
- Limpe `node_modules`: `rm -rf node_modules && npm install`
- Verifique variáveis de ambiente
- Confirme endpoints no `.env`

### Backend
- Verifique logs: `npm run logs`
- Teste conexão com API
- Confirme portas disponíveis

### Database
- Check migrations: `npm run migrate:status`
- Verifique conexão: `npm run db:check`
- Reset do banco: `npm run db:reset`