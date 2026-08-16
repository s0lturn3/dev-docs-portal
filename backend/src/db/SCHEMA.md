## Schema para o banco de dados (SQLite)

Tabelas iniciais:

```sql
-- Usuários (só editores se cadastram; leitores são anônimos)
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Categorias/seções de navegação (ex: "Frontend", "Padrões de Código", "Componentes")
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  parent_id INTEGER REFERENCES categories(id) ON DELETE CASCADE, -- permite sub-categorias
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- Páginas de conteúdo
CREATE TABLE pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content_md TEXT NOT NULL,          -- o markdown em si
  created_by INTEGER REFERENCES users(id),
  updated_by INTEGER REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Tags (opcional, mas útil pra busca/filtro cross-categoria)
CREATE TABLE tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE page_tags (
  page_id INTEGER NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (page_id, tag_id)
);
```

Decisões para validar:

- **`slug` em vez de expor `id` na URL** — melhor pra links compartilháveis internamente (`/docs/padroes-de-commit` em vez de `/docs/47`), e facilita SEO interno/busca.
- **`parent_id` em categories** — permite navegação em árvore (ex: "Frontend > Angular > Componentes") sem precisar remodelar depois. Se achar overkill agora, pode simplificar pra categoria plana (sem `parent_id`) e adicionar depois — SQLite migra fácil com poucos dados.
- **Sem tabela de "versões/histórico"** — coerente com sua decisão de não fazer git-based. Se depois sentir falta de "quem mudou o quê e quando", dá pra adicionar uma `page_revisions` guardando snapshots a cada update, mas eu não implementaria isso de início — é complexidade que você disse não precisar.
- **`content_md` como TEXT direto na tabela** — sem separar em arquivo. Como é SQLite local e o volume de conteúdo é doc técnica (não vídeo/imagem pesada), isso é perfeitamente adequado; não tem necessidade de sistema de arquivo separado pra isso.

---

Modelo da tabela de anexos (attachments):

```sql
CREATE TABLE attachments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_id INTEGER NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,        -- nome original enviado pelo usuário (ex: "diagrama-auth.png")
  stored_name TEXT NOT NULL UNIQUE, -- nome real em disco (ex: "a1b2c3d4.png") - evita colisão/overwrite
  mime_type TEXT NOT NULL,        -- ex: "image/png", "application/pdf", "application/zip"
  size_bytes INTEGER NOT NULL,
  uploaded_by INTEGER REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

Decisões para validar:

- **`stored_name` separado de `file_name`** — isso é importante, não é só estética. Se dois editores fizerem upload de arquivos chamados `diagrama.png` em páginas diferentes (ou até na mesma), sem esse campo você tem overwrite silencioso no disco. Gere o `stored_name` com um UUID/hash + extensão original (ex: `crypto.randomUUID() + path.extname(originalName)`), guarde o nome "bonito" só em `file_name` pra exibir na UI.
- **`ON DELETE CASCADE` em `page_id`** — isso limpa a linha do banco quando a página é deletada, mas não apaga o arquivo físico do disco. Isso é uma armadilha comum: o registro some do DB, o arquivo fica órfão em `uploads/`. Você vai precisar, no código do backend (não no SQL), fazer o delete do arquivo físico antes de deletar a página — ex: buscar todos os `attachments` daquela página, `fs.unlink` de cada um, e só depois deletar a página (o cascade cuida do resto das linhas). Isso é lógica de aplicação, o SQL sozinho não resolve.
- **Path relativo em disco** — sugiro estruturar por página pra facilitar organização e eventual limpeza manual: `uploads/{page_id}/{stored_name}`. Assim se precisar auditar/limpar manualmente algum dia, é óbvio o que pertence a quê.
