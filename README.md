# Hwarin

Hwarin e uma plataforma web para autores publicarem historias seriadas, organizarem capitulos e interagirem com leitores. O projeto combina uma API em FastAPI com uma interface React/Vite protegida por autenticacao JWT.

## Funcionalidades

- Cadastro e login de usuarios com sessao JWT.
- Perfil de autor com nome publico, bio e avatar.
- Criacao, edicao, listagem e exclusao de historias.
- Organizacao de capitulos por historia.
- Busca por texto, status, idioma, genero e tags.
- Biblioteca com historias e autores seguidos.
- Comentarios e avaliacoes em historias.

## Stack

- Backend: Python, FastAPI, SQLAlchemy, SQLite ou PostgreSQL, PyJWT.
- Frontend: React, TypeScript, Vite, React Router, TanStack Query, Tailwind CSS.
- Documentacao: diagrama de modelagem em `docs/Modelagem.png`.

## Estrutura

```text
.
|-- backend/
|   |-- src/
|   |   |-- app.py              # cria e configura a API FastAPI
|   |   |-- config.py           # variaveis de ambiente centralizadas
|   |   |-- db/                 # conexao e bootstrap do banco
|   |   |-- models/             # modelos SQLAlchemy
|   |   |-- routes/             # endpoints da API
|   |   |-- schemas/            # contratos Pydantic
|   |   `-- utils/              # JWT, senha e usuario atual
|   |-- .env.example
|   `-- requirements.txt
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- context/
|   |   |-- hooks/
|   |   |-- pages/
|   |   |-- routes/
|   |   |-- services/
|   |   `-- types/
|   |-- .env.example
|   `-- package.json
`-- docs/
```

## Como rodar localmente

### Backend

```bash
cd backend
python -m venv .venv
.venv/Scripts/activate
pip install -r requirements.txt
copy .env.example .env
uvicorn src.app:app --reload --host 0.0.0.0 --port 3000
```

A documentacao interativa da API fica em `http://localhost:3000/docs`.

### Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Por padrao, o Vite usa proxy para `http://localhost:3000` nas rotas `/api`.

## Variaveis de ambiente

Backend:

- `ENVIRONMENT`: use `DEVELOPMENT` para ambiente local.
- `ALLOWED_ORIGINS`: origens liberadas no CORS, separadas por virgula.
- `DB_NAME`: caminho do SQLite local quando `DATABASE_URL` nao for usado.
- `DATABASE_URL`: URL de banco externo, como PostgreSQL.
- `JWT_SECRET_KEY`: chave usada para assinar tokens JWT.
- `ADMIN_USERNAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_ROLE`: seed opcional de usuario admin.

Frontend:

- `VITE_API_URL`: URL da API. Deixe vazio em desenvolvimento local para usar o proxy do Vite.

## Qualidade

Frontend:

```bash
cd frontend
npm run check
```

Backend:

```bash
python -m compileall backend/src
```
