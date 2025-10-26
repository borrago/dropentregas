# DropEntregas – Backend (Node + Express + Sequelize + PostgreSQL)

## Subir só o banco
```bash
docker compose up -d
# Postgres em localhost:5432 (user: dropuser / pass: droppass / db: dropdb)
```

## Rodar a API
```bash
npm install
npm run dev
# API em http://localhost:4000
```

A API cria/atualiza as tabelas automaticamente (sequelize.sync) e faz um seed de veículos e cupons.
