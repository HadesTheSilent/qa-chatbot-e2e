# 🧪 Guia de Testes

## Testes E2E (Cypress)

### Pré-requisitos
- Node.js 18+
- Serviços rodando (local ou Docker)

### Executando os Testes

```bash
cd chatbot-sut
npm run test
```

Para executar contra o ambiente Docker:
```bash
$env:CYPRESS_BASE_URL = "http://localhost"
npm run test
```

### Cenários BDD

Os testes E2E usam Cucumber para cenários em linguagem natural:

```gherkin
Feature: Chat de Atendimento
  Scenario: Abrir novo atendimento
    When eu envio "abrir atendimento nome=Maria contato=11999999999"
    Then devo ver confirmação do atendimento criado
    And o status deve ser "open"
```

## Testes de API (Supertest)

### Executando
```bash
cd atendimentos-api
npm test
```

### Estrutura
```
atendimentos-api/
└── test/
    ├── atendimentos.test.js    # Testes de integração
    └── setup.js                # Configuração do ambiente
```

## Testes via Postman/Newman

### Coleção
```bash
cd atendimentos-api
npm run test:postman
```

A coleção inclui:
- Criar atendimento
- Consultar por ID
- Atualizar status
- Validações de erro

## Cobertura de Testes

Para gerar relatório de cobertura:
```bash
cd atendimentos-api
npm run test:coverage
```

### Métricas Alvo
- Statements: >80%
- Branches: >75%
- Functions: >80%
- Lines: >80%

## Testes de Carga (k6)

Scripts de carga disponíveis em `load-tests/`:
```bash
k6 run load-tests/chat-flow.js
```

## CI/CD

Os testes são executados automaticamente:
- Pull Requests
- Push na main
- Deploy para produção