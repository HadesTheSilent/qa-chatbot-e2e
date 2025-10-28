# QA Chatbot E2E Wiki

Bem-vindo à documentação do QA Chatbot E2E. Este projeto demonstra uma implementação completa de um chatbot testável com uma arquitetura moderna e boas práticas de desenvolvimento.

## 📚 Índice

1. [Guia de Início Rápido](Quick-Start-Guide)
2. [Arquitetura](Architecture)
3. [API Reference](API-Reference)
4. [Guia de Desenvolvimento](Development-Guide)
5. [Testes](Testing-Guide)
6. [Docker](Docker-Guide)

## 🎯 Propósito

Este projeto serve como uma demonstração prática de:
- Desenvolvimento modular e testável
- Integração contínua com testes automatizados
- Containerização com Docker
- Documentação clara e manutenível
- Boas práticas de desenvolvimento em Node.js/React

## 📋 Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- Git
- IDE recomendada: VS Code

## 🔗 Links Úteis

- [Repositório principal](https://github.com/HadesTheSilent/qa-chatbot-e2e)
- [Guia de contribuição (arquivo no repositório)](https://github.com/HadesTheSilent/qa-chatbot-e2e/blob/main/CONTRIBUTING.md)
- [Changelog (arquivo no repositório)](https://github.com/HadesTheSilent/qa-chatbot-e2e/blob/main/CHANGELOG.md)

---

## 🧪 Testes

Esta seção descreve o fluxo de testes do projeto, como executar localmente, em Docker e no CI.

1) Testes E2E (Cypress)

- Localmente (modo desenvolvimento):

	```powershell
	cd chatbot-sut
	# instala dependências se necessário
	npm install
	# garante backend e API rodando (veja README das pastas)
	npm run test:e2e
	```

- Executar contra ambiente Docker (recomendado para parity):

	```powershell
	docker compose up --build -d
	# ajuste CYPRESS_BASE_URL se necessário
	$env:CYPRESS_BASE_URL = "http://localhost"
	cd chatbot-sut
	npm run test
	```

2) Testes de API (Supertest / Jest)

- Executar os testes da API de atendimentos:

	```powershell
	cd atendimentos-api
	npm install
	npm test
	```

3) Testes de carga e outros (k6)

- Scripts de carga ficam em `load-tests/` (se presente). Exemplo:

	```powershell
	k6 run load-tests/chat-flow.js
	```

4) Integração com CI

- O pipeline de CI roda os testes em Pull Requests. Se algum teste falhar, revise os logs do job e corrija localmente antes de re-submeter.
