# 🚀 Guia de Início Rápido

## Usando Docker (Recomendado)

A maneira mais rápida de executar o projeto é usando Docker Compose:

```bash
git clone <seu-repositorio>
cd qa-chatbot-e2e
docker compose up --build
```

Acesse:
- Frontend: http://localhost
- Documentação da API: http://localhost:4000/api-docs
- API de Atendimentos: http://localhost:5000

## Desenvolvimento Local

### 1. Preparação do Ambiente

```bash
# Clone o repositório
git clone <seu-repositorio>
cd qa-chatbot-e2e

# Instale as dependências do backend
cd chatbot-sut/backend
npm install

# Instale as dependências do frontend
cd ../frontend
npm install

# Instale as dependências da API de atendimentos
cd ../../atendimentos-api
npm install
```

### 2. Variáveis de Ambiente

Crie um arquivo `.env` em cada diretório:

Backend (`chatbot-sut/backend/.env`):
```env
PORT=4000
ATENDIMENTOS_API_URL=http://localhost:5000
NODE_ENV=development
```

Frontend (`chatbot-sut/frontend/.env`):
```env
VITE_API_URL=http://localhost:4000
```

API de Atendimentos (`atendimentos-api/.env`):
```env
PORT=5000
DB_TYPE=sqlite
```

### 3. Executando os Serviços

Em terminais separados:

```bash
# Terminal 1: Backend
cd chatbot-sut/backend
npm start

# Terminal 2: Frontend
cd chatbot-sut/frontend
npm run dev

# Terminal 3: API de Atendimentos
cd atendimentos-api
npm start
```

## Verificando a Instalação

1. Acesse http://localhost:5173 no navegador
2. Tente enviar uma mensagem: `abrir atendimento nome=Teste contato=123`
3. Verifique o status: `status atendimento 1`

Se tudo estiver funcionando, você verá respostas do NeonBot confirmando as operações.