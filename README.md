# 📘 DevDocs Portal

Portal interno de documentação técnica em Markdown, focado em componentes, padrões de código e tutoriais para os times de desenvolvimento. Pense em algo no espírito do Notion, porém mais simples, estático e sem as complexidades de um editor colaborativo em tempo real.

Projeto interno — uso restrito à rede/infraestrutura da empresa.

## Motivação

Este projeto substitui uma versão anterior do portal, escrita em Angular com conteúdo em HTML e um componente separado por página. Aquela abordagem não escalou bem conforme a quantidade de documentação cresceu. Esta reescrita move o conteúdo para Markdown puro, simplificando drasticamente a criação e manutenção de páginas, e revisita a stack para reduzir complexidade desnecessária.

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Angular 19+ |
| Backend | Node.js + TypeScript + Express |
| Persistência | SQLite (arquivo único, sem servidor de banco separado) |
| Autenticação | JWT simples, isolada do SSO corporativo |
| Hospedagem | IIS (via [iisnode](https://github.com/Azure/iisnode)) |

### Por que essa stack

- **SQLite em vez de PostgreSQL**: o portal tem no máximo 2 editores simultâneos e uma única instância do backend rodando. Não há necessidade de um SGBD cliente-servidor; SQLite resolve com zero infraestrutura adicional (sem container, sem processo de banco separado, backup = copiar um arquivo).
- **Express em vez de NestJS**: o escopo é um CRUD relativamente simples (páginas, categorias, tags, anexos). A estrutura de módulos/DI do NestJS não se paga para este volume de features.
- **Leitura aberta, escrita protegida**: a leitura do conteúdo não exige login (o portal já está atrás da rede interna da empresa). Apenas as rotas de escrita (criar/editar/excluir páginas e anexos) exigem autenticação via JWT com role de editor.

## Estrutura de pastas (proposta)

```
devdocs-portal/
├── database.db                  # arquivo SQLite (raiz do projeto)
├── backend/
│   ├── src/
│   │   ├── config/               # configuração de ambiente, conexão com SQLite
│   │   ├── db/
│   │   │   ├── migrations/       # scripts de criação/alteração de schema
│   │   │   └── seed.ts           # script de cadastro manual de editores
│   │   ├── modules/
│   │   │   ├── pages/            # controller, service, routes de páginas
│   │   │   ├── categories/
│   │   │   ├── tags/
│   │   │   ├── attachments/
│   │   │   └── auth/             # login, geração/validação de JWT
│   │   ├── middlewares/          # auth guard, error handler, upload (multer)
│   │   ├── types/                # tipos/DTOs compartilhados
│   │   └── server.ts             # entry point
│   ├── uploads/                  # arquivos anexados às páginas (imagens, PDFs, etc.)
│   ├── web.config                # configuração do iisnode para deploy no IIS
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/              # serviços singleton, guards, interceptors
│   │   │   ├── features/
│   │   │   │   ├── pages/         # visualização e edição de páginas
│   │   │   │   ├── navigation/    # árvore de categorias/sidebar
│   │   │   │   └── auth/          # tela de login (editores)
│   │   │   └── shared/            # componentes/pipes reutilizáveis (ex: markdown renderer)
│   │   └── environments/
│   ├── angular.json
│   └── package.json
└── README.md
```

> Nota: o arquivo `database.db` fica versionado fora do Git (adicionar ao `.gitignore`), mantendo apenas as migrations versionadas. O banco em si é gerado/populado localmente a partir das migrations + seed.

## Modelo de dados (resumo)

- **users** — apenas editores se cadastram (cadastro manual, sem self-signup). Leitores não autenticados têm acesso de leitura.
- **categories** — suporta hierarquia via `parent_id`, usada para montar a navegação em árvore.
- **pages** — conteúdo em Markdown (`content_md`), vinculado a uma categoria, com slug único para URLs amigáveis.
- **tags** / **page_tags** — categorização cruzada, independente da árvore de categorias.
- **attachments** — arquivos referenciados dentro das páginas (imagens, PDFs, zips, etc.), com nome de exibição separado do nome físico em disco para evitar colisões.

## Rodando localmente

```bash
# Backend
cd backend
npm install
npm run migrate      # cria o schema no database.db
npm run seed         # cadastra o(s) editor(es) inicial(is)
npm run dev

# Frontend
cd frontend
npm install
ng serve
```

## Roadmap

### V1 — MVP
- [ ] CRUD de páginas em Markdown (criar, editar, excluir, listar)
- [ ] Navegação em árvore por categorias
- [ ] Renderização de Markdown no frontend (com suporte a syntax highlighting para blocos de código)
- [ ] Upload de anexos (imagens e arquivos) vinculados a páginas
- [ ] Autenticação de editores via JWT
- [ ] Deploy funcional no IIS via iisnode

### V2 — Melhorias de uso
- [ ] Busca full-text no conteúdo das páginas (SQLite FTS5)
- [ ] Sistema de tags com filtro na navegação
- [ ] Editor Markdown com preview lado a lado (ex: baseado em CodeMirror/Monaco)
- [ ] Breadcrumbs e link "página relacionada"
- [ ] Página 404 / busca de conteúdo movido/renomeado (slug antigo → novo)

### V3 — Possíveis evoluções futuras
- [ ] Histórico de revisões por página (`page_revisions`, snapshot a cada update)
- [ ] Exportação de página/seção para PDF
- [ ] Modo "somente leitura offline" (export estático do portal inteiro)
- [ ] Métricas simples de acesso (páginas mais visitadas, sem tracking pessoal)
- [ ] Suporte a múltiplos editores com permissões por categoria (hoje é all-or-nothing)

> Itens do V3 não são compromissos — são ideias registradas para avaliação futura, condicionadas a necessidade real de uso do portal.

## Decisões conscientemente fora de escopo

- **Sem múltiplas instâncias do backend**: SQLite não é adequado para escrita concorrente entre processos separados. Se isso mudar no futuro, é necessário revisitar a escolha de banco (provável migração para PostgreSQL).
- **Sem versionamento via Git do conteúdo**: o conteúdo markdown vive no banco, não em arquivos versionados. Histórico de mudanças, se necessário, será resolvido via `page_revisions` (ver roadmap V3), não via Git.
- **Sem integração com o SSO corporativo**: autenticação isolada e cadastro manual, por ser um volume muito baixo de editores (no máximo 2).