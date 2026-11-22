# Sequelize + Supabase API (for Angular 16)

REST API built with Node.js, Express, Sequelize ORM and Supabase (managed PostgreSQL - a relational database).

## Quick start
```bash
npm install
cp .env.example .env        # fill in DATABASE_URL from Supabase
npm run db:migrate          # create tables
npm run db:seed             # optional demo data
npm run dev                 # http://localhost:3000/api/v1/health
```

## Supabase setup
1. Create a project at supabase.com.
2. Project Settings -> Database -> Connection string -> URI. Put it in `DATABASE_URL`.
3. Direct connections are IPv6-only; if you get `ENETUNREACH`/timeouts use the **Session pooler** string (port 5432).
4. SSL is required (handled in config; set `DB_SSL=false` only for a local Postgres).

## Structure
```
config/          sequelize-cli config
migrations/      versioned schema (use these in production, never sync())
seeders/         demo data
src/config/      env + Sequelize connection
src/models/      User, Task (User 1-N Task)
src/routes|controllers|services|validators|middlewares
docs/angular16-integration.md
```

## Endpoints (prefix /api/v1)
| Method | Path | Description |
|---|---|---|
| GET | /health | API + DB check |
| GET/POST | /users | list (paginated) / create |
| GET/PATCH/DELETE | /users/:id | read (with tasks) / update / delete |
| GET/POST | /tasks | list (?page&limit&status&userId) / create |
| GET/PATCH/DELETE | /tasks/:id | read / update / delete |

Responses: `{ success, data, meta }`; errors: `{ success: false, message, details }`.

## New migration
`npx sequelize-cli migration:generate --name add-something`
