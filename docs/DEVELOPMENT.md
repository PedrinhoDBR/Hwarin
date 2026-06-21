# Guia de desenvolvimento

Este documento resume padroes do projeto para manter backend e frontend consistentes.

## Backend

- O ponto de entrada da API fica em `backend/src/app.py`.
- Configuracoes de ambiente ficam centralizadas em `backend/src/config.py`.
- Criacao de tabelas, ajustes temporarios de schema e seed opcional ficam em `backend/src/db/bootstrap.py`.
- Rotas devem ficar em `backend/src/routes` e usar schemas de `backend/src/schemas` para entrada e saida.
- Modelos SQLAlchemy ficam em `backend/src/models`.
- Novas rotas devem ser registradas em `create_app()`.

### Banco de dados

Em desenvolvimento local, o projeto usa SQLite quando `DATABASE_URL` nao esta definida. Para ambientes compartilhados ou deploy, prefira PostgreSQL via `DATABASE_URL`.

O seed de admin e opcional. Para ativar localmente, preencha:

```env
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me
ADMIN_ROLE=admin
```

## Frontend

- Paginas ficam em `frontend/src/pages`.
- Componentes reutilizaveis ficam em `frontend/src/components`.
- Chamadas HTTP ficam centralizadas em `frontend/src/services`.
- Tipos compartilhados ficam em `frontend/src/types`.
- Rotas privadas ficam declaradas em `frontend/src/routes/privateRoutes.tsx`.

## Validacao antes de subir alteracoes

Execute:

```bash
cd frontend
npm run check
```

E compile o backend:

```bash
cd ..
python -m compileall backend/src
```

## Proximas melhorias recomendadas

- Adicionar testes automatizados para rotas criticas de autenticacao, historias e capitulos.
- Substituir os ajustes temporarios de schema por migracoes versionadas com Alembic.
- Adicionar CI no GitHub Actions com lint, typecheck, build e compile do backend.
- Revisar endpoints administrativos para exigir permissao de admin onde fizer sentido.
