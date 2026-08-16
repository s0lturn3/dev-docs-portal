# 📘 DevDocs Portal

Internal technical documentation portal in Markdown, focused on components, code patterns and tutorials for development teams. Think of something in the spirit of Notion, but simpler, static and without the complexities of a real-time collaborative editor.

Internal project — restricted use to company network/infrastructure.

## Motivation

This project replaces a previous version of the portal, written in Angular with HTML content and a separate component per page. That approach did not scale well as the amount of documentation grew. This rewrite moves content to plain Markdown, drastically simplifying page creation and maintenance, and revisits the stack to reduce unnecessary complexity.

## Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 19+ |
| Backend | Node.js + TypeScript + Express |
| Persistence | SQLite (single file, no separate database server) |
| Authentication | Simple JWT, isolated from corporate SSO |
| Hosting | IIS (via [iisnode](https://github.com/Azure/iisnode)) |

### Why this stack

- **SQLite instead of PostgreSQL**: the portal has at most 2 simultaneous editors and a single backend instance running. There is no need for a client-server DBMS; SQLite solves with zero additional infrastructure (no container, no separate database process, backup = copy a file).
- **Express instead of NestJS**: the scope is a relatively simple CRUD (pages, categories, tags, attachments). NestJS's module/DI structure doesn't pay for this volume of features.
- **Open reading, protected writing**: content reading doesn't require login (the portal is already behind the company's internal network). Only write routes (create/edit/delete pages and attachments) require authentication via JWT with editor role.

## Folder Structure (proposed)

```
devdocs-portal/
├── database.db                  # SQLite file (project root)
├── backend/
│   ├── src/
│   │   ├── config/               # environment configuration, SQLite connection
│   │   ├── db/
│   │   │   ├── database.ts       # table creation scripts and database initialization
│   │   │   └── seed.ts           # manual editor registration script
│   │   ├── modules/              # controllers, services, repositories
│   │   │   ├── pages/
│   │   │   ├── categories/
│   │   │   ├── tags/
│   │   │   ├── attachments/
│   │   │   ├── auth/             # login, JWT generation/validation
│   │   │   └── routes.ts         # central file for module routes
│   │   ├── middlewares/          # auth guard, error handler, upload (multer)
│   │   ├── types/                # shared types/DTOs
│   │   └── index.ts              # backend entry point
│   ├── uploads/                  # files attached to pages (images, PDFs, etc.)
│   ├── web.config                # iisnode configuration for IIS deployment
│   ├── package.json
│   ├── server.ts                 # entry point
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/              # singleton services, guards, interceptors
│   │   │   ├── features/
│   │   │   │   ├── pages/         # page viewing and editing
│   │   │   │   ├── navigation/    # category tree/sidebar
│   │   │   │   └── auth/          # editor login screen
│   │   │   └── shared/            # reusable components/pipes (ex: markdown renderer)
│   │   └── environments/
│   ├── angular.json
│   └── package.json
└── README.md
```

> Note: the `database.db` file stays versioned outside Git (add to `.gitignore`), keeping only the migrations versioned. The database itself is generated/populated locally from migrations + seed.

## Data Model (summary)

- **users** — only editors register (manual registration, no self-signup). Unauthenticated readers have read access.
- **categories** — supports hierarchy via `parent_id`, used to build tree navigation.
- **pages** — content in Markdown (`content_md`), linked to a category, with unique slug for friendly URLs.
- **tags** / **page_tags** — cross-categorization, independent of category tree.
- **attachments** — files referenced within pages (images, PDFs, zips, etc.), with display name separate from physical filename to avoid collisions.

## Running locally

```bash
# Backend
cd backend
npm install
npm run migrate      # creates schema in database.db
npm run seed         # registers initial editor(s)
npm run dev

# Frontend
cd frontend
npm install
ng serve
```

## Roadmap

### V1 — MVP
- [X] CRUD for pages in Markdown (create, edit, delete, list)
- [ ] Tree navigation by categories
- [ ] Markdown rendering on frontend (with syntax highlighting support for code blocks)
- [ ] File upload (images and files) linked to pages
- [ ] Editor authentication via JWT
- [ ] Functional deployment on IIS via iisnode

### V2 — Use Improvements
- [ ] Full-text search in page content (SQLite FTS5)
- [ ] Tag system with filtering in navigation
- [ ] Markdown editor with side-by-side preview (e.g. based on CodeMirror/Monaco)
- [ ] Breadcrumbs and "related page" link
- [ ] 404 page / search for moved/renamed content (old slug → new)

### V3 — Possible Future Evolutions
- [ ] Page revision history (`page_revisions`, snapshot on each update)
- [ ] Export page/section to PDF
- [ ] "Read-only offline" mode (static export of entire portal)
- [ ] Simple access metrics (most visited pages, no personal tracking)
- [ ] Support for multiple editors with category-based permissions (currently all-or-nothing)

> V3 items are not commitments — they are ideas registered for future evaluation, conditional on actual need to use the portal.

## Decisions deliberately out of scope

- **No multiple backend instances**: SQLite is not suitable for concurrent writes between separate processes. If this changes in the future, it will be necessary to revisit the database choice (likely migration to PostgreSQL).
- **No Git versioning of content**: markdown content lives in the database, not in versioned files. Change history, if needed, will be solved via `page_revisions` (see V3 roadmap), not via Git.
- **No corporate SSO integration**: isolated authentication and manual registration, as there is a very low volume of editors (at most 2).