---
name: Feature Artigos com Backend
overview: Adicionar a feature de artigos com backend FastAPI (backend-team), armazenamento em markdown em backend/storage/articles, API REST, frontend Next.js em frontend/ que consome a API, e item "Artigos" no menubar. Todo o frontend existente é movido para frontend/.
todos: []
isProject: false
---

# Feature de Artigos com Backend FastAPI (backend-team)

## Contexto

O projeto é um site Next.js 15 (App Router). **Todo o frontend será movido para `frontend/`** (app, components, lib, public, package.json, next.config.ts, tsconfig.json, etc.). Não existe pasta `backend` hoje. O menu está em [frontend/components/site-header.tsx](frontend/components/site-header.tsx). O backend será criado do zero seguindo o skill **backend-team**: FastAPI, Python 3.12, SQLModel, Alembic, PostgreSQL, Pipenv, arquitetura Model → DTO → Repository → Service → Controller.

## Arquitetura

```mermaid
flowchart TB
  subgraph storage [Storage]
    MD["backend/storage/articles/*.md"]
  end
  subgraph backend [Backend FastAPI]
    Model[models/article.py]
    DTO[dtos/article_dto.py]
    Repo[repositories/article_repository.py]
    Svc[services/article_service.py]
    Ctrl[controllers/article_controller.py]
    Sync[sync metadata from .md to DB]
  end
  subgraph frontend [Frontend Next.js frontend/]
    List[frontend/app/artigos/page.tsx]
    Detail[frontend/app/artigos/[slug]/page.tsx]
    Menu[frontend/components/site-header]
  end
  MD --> Sync
  Sync --> Model
  Model --> Repo --> Svc --> Ctrl
  DTO --> Ctrl
  Ctrl -->|GET /articles| List
  Ctrl -->|GET /articles/{slug}| Detail
  Menu -->|link /artigos| List
```



- **Storage**: arquivos `.md` em `backend/storage/articles/` (slug = nome sem `.md`). Frontmatter: `title`, `date`, `summary`. Corpo em markdown.
- **Backend**: serviço FastAPI com PostgreSQL. Metadados dos artigos (slug, title, published_at, summary) ficam na tabela `article`; o conteúdo é lido do arquivo `.md` sob demanda no GET por slug. Sync (metadata .md → DB) pode ser feito na inicialização do backend ou via endpoint/script.
- **Frontend**: vive em `frontend/`; páginas Next.js que consomem a API do backend (lista e detalhe) e item "Artigos" no menubar.

## Implementação

### 0. Mover todo o frontend para `frontend/`

Antes das demais etapas, mover o app Next.js para dentro de `frontend/`:

- Criar pasta **`frontend/`** na raiz do repositório.
- Mover para `frontend/`: **`app/`**, **`components/`**, **`lib/`**, **`public/`**, **`package.json`**, **`package-lock.json`**, **`next.config.ts`**, **`postcss.config.mjs`**, **`tsconfig.json`**, **`components.json`**, **`eslint.config.mjs`**, **`Dockerfile`** (do Next.js), **`.dockerignore`** (ou criar um em `frontend/` adequado).
- Ajustar imports no frontend que referenciam `@/` (ex.: `@/components/...`, `@/lib/...`): manter o alias `@` apontando para `frontend/` no `tsconfig.json` do frontend (ex.: `"paths": { "@/*": ["./*"] }` dentro de `frontend/`).
- Ajustar caminhos que sobem da raiz: ex. em [frontend/app/layout.tsx](frontend/app/layout.tsx) as fontes usam `../public/fonts/...` (relativo a `frontend/app/`, então `../public` = `frontend/public`); conferir após a mudança.
- **Compose**: serviço `frontend` deve usar `context: frontend` e `dockerfile: frontend/Dockerfile` (ou `context: .` e `file: frontend/Dockerfile` com ajuste de COPY para `frontend/`). Volumes: `./frontend:/app` (e preservar `/app/.next`).
- **CI**: em [.github/workflows/docker-build.yaml](.github/workflows/docker-build.yaml), alterar build do frontend para `context: frontend` e `file: frontend/Dockerfile` (ou o path escolhido). Se o workflow buildar apenas o frontend, isso basta; se no futuro houver build do backend no mesmo repo, separar jobs ou contextos.

Estrutura final na raiz: **`frontend/`** (Next.js) e **`backend/`** (FastAPI) como irmãos; **`compose.yaml`** na raiz orquestrando postgres, backend e frontend.

### 1. Estrutura do backend (FastAPI + backend-team)

Criar a árvore mínima do backend e core:

- **`backend/core/BaseModel.py`**: modelo base com `id`, `created_at`, `updated_at`, `deleted_at` (SQLModel, usado para soft delete).
- **`backend/core/BaseRepository.py`**: repositório genérico (get_by_id, list_all com paginação, create, update, delete com filtro `deleted_at is None`).
- **`backend/database/engine.py`**: engine SQLModel + `get_session()` (dependency) para PostgreSQL.
- **`backend/libraries/env.py`**: `pydantic_settings.BaseSettings` com `DATABASE_URL`, `ENVIRONMENT`, `BACKEND_API_ROOT_PATH`; carregar de `.env`.
- **`backend/main.py`**: app FastAPI, incluir router dos artigos, CORS se necessário para o frontend chamar de outro origin/porta.
- **`backend/Pipfile`**: Python 3.12, fastapi, uvicorn, sqlmodel, alembic, pydantic-settings, psycopg2-binary, pyyaml (ou python-frontmatter para parse de .md).
- **`backend/.env.example`**: exemplo com `DATABASE_URL` e variáveis usadas pelo backend.
- **Alembic**: `backend/alembic.ini` e `backend/alembic/` com env.py usando o mesmo `DATABASE_URL`; migrations em `alembic/versions/`.

Scripts no Pipfile (ex.: `migrate-create`, `migrate-apply`, `run`) conforme o skill.

### 2. Model Article

- **`backend/models/article.py`**: herdar de `BaseModel`, `table=True`. Campos: `slug` (unique, index), `title`, `published_at` (datetime), `summary` (opcional). Não guardar conteúdo no banco; conteúdo sempre lido de `backend/storage/articles/{slug}.md`.

### 3. DTOs Article

- **`backend/dtos/article_dto.py`**:
  - **ArticleResponse**: id, slug, title, published_at, summary, created_at, updated_at (`from_attributes = True`).
  - **ArticleDetailResponse**: herda/copia ArticleResponse + campo `content: str` (conteúdo markdown).
  - Create/Update opcionais: se houver apenas sync a partir de .md, podem ser omitidos ou usados só internamente no sync.

### 4. Repository e Service

- **`backend/repositories/article_repository.py`**: herdar `BaseRepository[Article]`. Métodos: `get_by_slug(slug: str) -> Article | None` (e os já fornecidos pelo base).
- **`backend/services/article_service.py`**:
  - Dependency Injection com `get_session` e `ArticleRepository`.
  - `list_all(skip, limit)`: retorna lista de Article (ordenada por `published_at` desc).
  - `get_by_slug(slug)`: busca Article no repositório; se existir, lê conteúdo de `backend/storage/articles/{slug}.md` (path configurável via env ou constante), monta e retorna DTO com `content`; se arquivo não existir ou artigo não existir, retorna None.
  - **Sync artigos**: função que varre `backend/storage/articles/*.md`, parseia frontmatter (YAML com title, date, summary), slug = nome do arquivo sem `.md`; upsert na tabela Article (insert ou update por slug). Pode ser chamada no startup do FastAPI (lifespan) ou via endpoint administrativo/script.

### 5. Controller Article

- **`backend/controllers/article_controller.py`**: APIRouter com prefix `/articles` (ou conforme convenção do projeto).
  - `GET ""`: lista artigos (response_model=list[ArticleResponse]), query params skip/limit.
  - `GET "/{slug}"`: artigo por slug (response_model=ArticleDetailResponse); se não existir, 404.
  - Opcional: `POST /sync` (ou similar) para disparar sync .md → DB, se não fizer sync no startup.
- Registrar router em `main.py`. Tag sugerida: "Articles" (e enum RoutesTagEnum se o projeto usar).

### 6. Migração Alembic

- Criar migração "create article table" com colunas: id, slug (unique), title, published_at, summary, created_at, updated_at, deleted_at.

### 7. Storage e sync

- Criar **`backend/storage/articles/`** e um artigo exemplo **`exemplo.md`** com frontmatter (title, date, summary) e corpo em markdown.
- Convenção: um `.md` por artigo; slug = nome do arquivo sem extensão. Conteúdo do arquivo = frontmatter + body; no GET por slug o backend retorna metadata do DB + body lido do arquivo (evita duplicar conteúdo grande no banco).

### 8. Docker / Compose

- **`compose.yaml`** (na raiz):
  - Serviço **postgres**: PostgreSQL 18, volume, variáveis POSTGRES_*, porta 5432.
  - Serviço **backend**: build do backend (context `backend/` ou `./backend`), comando uvicorn, env DATABASE_URL apontando para o postgres, porta 8000; volume para `backend/storage` e código.
  - Serviço **frontend**: build com **context `frontend/`**, **dockerfile `frontend/Dockerfile`**; volumes `./frontend:/app` e `/app/.next`; env `NEXT_PUBLIC_API_URL=http://backend:8000` (ou URL adequada para o browser/SSR). Garantir que o frontend existente rode a partir de `frontend/` (ver etapa 0).

### 9. Frontend Next.js (em `frontend/`)

- **Chamadas à API**: as páginas (ou funções server-side) fazem fetch para o backend (ex.: `GET {API_URL}/articles`, `GET {API_URL}/articles/{slug}`). Usar variável de ambiente para a URL base da API (ex.: `NEXT_PUBLIC_API_URL` ou API route no Next que faz proxy ao backend).
- **`frontend/app/artigos/page.tsx`**: Server Component que busca lista da API e exibe cards (título, data, resumo) com links para `/artigos/[slug]`.
- **`frontend/app/artigos/[slug]/page.tsx`**: Server Component que busca artigo por slug na API; se 404, `notFound()`; senão renderiza título, data e conteúdo em markdown (usar `react-markdown` + opcional `remark-gfm`).
- **`frontend/components/site-header.tsx`**: adicionar em `navItems` item `{ href: "/artigos", label: "Artigos" }` (ex.: entre "Carreira" e "Fale comigo").
- **Dependências**: em `frontend/package.json`, adicionar `react-markdown` (e opcionalmente `remark-gfm`); não é necessário `gray-matter` no Next (o parse fica no backend).

### 10. Resumo de arquivos

**Backend (criar do zero)**

- `backend/core/BaseModel.py`, `backend/core/BaseRepository.py`
- `backend/database/engine.py`, `backend/libraries/env.py`
- `backend/models/article.py`, `backend/dtos/article_dto.py`, `backend/repositories/article_repository.py`, `backend/services/article_service.py`, `backend/controllers/article_controller.py`
- `backend/main.py`, `backend/Pipfile`, `backend/.env.example`
- `backend/storage/articles/`, `backend/storage/articles/exemplo.md`
- `backend/alembic.ini`, `backend/alembic/env.py`, `backend/alembic/versions/` + migração create article table
- Enum de tags de rotas (se usar): ex. `backend/enums/RoutesTagEnum.py`

**Compose e CI**

- Editar `compose.yaml`: serviço postgres, serviço backend, serviço frontend com context `frontend/` e `frontend/Dockerfile`; frontend com env para URL da API.
- Editar `.github/workflows/docker-build.yaml`: build do frontend com `context: frontend`, `file: frontend/Dockerfile`.

**Frontend (tudo em `frontend/`)**

- Mover código existente para `frontend/` (etapa 0).
- Criar `frontend/app/artigos/page.tsx`, `frontend/app/artigos/[slug]/page.tsx`.
- Editar `frontend/components/site-header.tsx` (item Artigos).
- Editar `frontend/package.json`: adicionar `react-markdown` (e opcionalmente `remark-gfm`).
