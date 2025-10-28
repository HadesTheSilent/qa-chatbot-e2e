# 📚 API Reference

## Backend do Chatbot

### POST /api/message

Processa uma mensagem do usuário e retorna a resposta apropriada.

#### Request
```json
{
  "message": "string"
}
```

#### Response
```json
{
  "reply": "string"
}
```

#### Exemplos

Abrir atendimento:
```bash
curl -X POST http://localhost:4000/api/message \
  -H "Content-Type: application/json" \
  -d '{"message": "abrir atendimento nome=João contato=11999999999"}'
```

Consultar status:
```bash
curl -X POST http://localhost:4000/api/message \
  -H "Content-Type: application/json" \
  -d '{"message": "status atendimento 42"}'
```

## API de Atendimentos

### POST /atendimentos

Cria um novo atendimento.

#### Request
```json
{
  "nome": "string",
  "contato": "string"
}
```

#### Response
```json
{
  "id": "number",
  "nome": "string",
  "contato": "string",
  "status": "string",
  "created_at": "string"
}
```

### GET /atendimentos/{id}

Obtém detalhes de um atendimento específico.

#### Parameters
- `id`: ID do atendimento (number)

#### Response
```json
{
  "id": "number",
  "nome": "string",
  "contato": "string",
  "status": "string",
  "created_at": "string",
  "updated_at": "string"
}
```

### PUT /atendimentos/{id}

Atualiza o status de um atendimento.

#### Parameters
- `id`: ID do atendimento (number)

#### Request
```json
{
  "status": "string"
}
```

#### Response
```json
{
  "id": "number",
  "nome": "string",
  "contato": "string",
  "status": "string",
  "updated_at": "string"
}
```

## Códigos de Status

- `200`: Sucesso
- `201`: Criado com sucesso
- `400`: Requisição inválida
- `404`: Recurso não encontrado
- `500`: Erro interno do servidor

## Formatos de Mensagem

### Comandos do Chat

1. Abrir Atendimento
   ```
   abrir atendimento nome=<nome> contato=<contato>
   ```

2. Consultar Status
   ```
   status atendimento <id>
   ```

3. Encerrar Atendimento
   ```
   fechar atendimento <id>
   ```

### Status de Atendimento

- `open`: Atendimento em aberto
- `closed`: Atendimento encerrado