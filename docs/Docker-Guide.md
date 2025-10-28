# 🐳 Docker Guide

## Visão Geral

O projeto usa Docker para garantir ambientes consistentes e facilitar o deploy.

## Quickstart

```bash
# Build e execução
docker compose up --build

# Em background
docker compose up -d

# Logs
docker compose logs -f
```

## Serviços

### Frontend (React/Vite)
```yaml
frontend:
  build: ./chatbot-sut/frontend
  ports:
    - "80:80"
  environment:
    - VITE_API_URL=http://backend:4000
```

### Backend (Express)
```yaml
backend:
  build: ./chatbot-sut/backend
  ports:
    - "4000:4000"
  environment:
    - ATENDIMENTOS_API_URL=http://atendimentos-api:5000
```

### API de Atendimentos
```yaml
atendimentos-api:
  build: ./atendimentos-api
  ports:
    - "5000:5000"
  environment:
    - DB_TYPE=postgres
```

## Volumes

- PostgreSQL: `/var/lib/postgresql/data`
- Uploads: `/app/uploads`
- Logs: `/app/logs`

## Redes

- `frontend-network`: Frontend ↔ Backend
- `backend-network`: Backend ↔ API
- `db-network`: API ↔ Database

## Desenvolvimento

### Hot Reload
Use bind mounts:
```yaml
volumes:
  - ./src:/app/src
```

### Debug
Exponha portas de debug:
```yaml
ports:
  - "9229:9229"
```

## Produção

### Multi-stage Builds
```dockerfile
# Build
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

# Runtime
FROM node:18-slim
COPY --from=builder /app/dist ./dist
CMD ["npm", "start"]
```

### Health Checks
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:4000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

## Troubleshooting

### Logs
```bash
# Todos os serviços
docker compose logs

# Serviço específico
docker compose logs backend
```

### Limpeza
```bash
# Remove containers
docker compose down

# Remove volumes
docker compose down -v

# Remove imagens
docker compose down --rmi all
```

### Debugging
```bash
# Shell no container
docker compose exec backend sh

# Inspecionar rede
docker network inspect backend-network
```

## Best Practices

1. Use multi-stage builds
2. Minimize camadas
3. Configure health checks
4. Use volumes para persistência
5. Defina restart policies
6. Monitore recursos
7. Faça backup dos volumes