## Database Schema (SQLite)

Initial tables:

```sql
-- Users (only editors register; readers are anonymous)
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Categories/navigation sections (e.g: "Frontend", "Code Patterns", "Components")
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  parent_id INTEGER REFERENCES categories(id) ON DELETE CASCADE, -- allows sub-categories
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- Content pages
CREATE TABLE pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content_md TEXT NOT NULL,          -- the markdown itself
  created_by INTEGER REFERENCES users(id),
  updated_by INTEGER REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Tags (optional, but useful for cross-category search/filter)
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

Design decisions to validate:

- **`slug` instead of exposing `id` in URL** — better for internally shareable links (`/docs/commit-patterns` instead of `/docs/47`), and facilitates internal SEO/search.
- **`parent_id` in categories** — enables tree navigation (e.g: "Frontend > Angular > Components") without needing to remodel later. If it feels like overkill now, you can simplify to flat categories (without `parent_id`) and add later — SQLite migrates easily with little data.
- **No "version/history" table** — consistent with your decision not to do git-based. If you later miss "who changed what and when", you can add a `page_revisions` table storing snapshots on each update, but I wouldn't implement it initially — it's complexity you said you don't need.
- **`content_md` as TEXT directly in table** — without separating into a file. Since it's local SQLite and the content volume is technical docs (not heavy video/images), this is perfectly adequate; no need for a separate file system for this.

---

Attachments table model:

```sql
CREATE TABLE attachments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_id INTEGER NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,        -- original filename submitted by user (e.g: "diagram-auth.png")
  stored_name TEXT NOT NULL UNIQUE, -- actual filename on disk (e.g: "a1b2c3d4.png") - avoids collision/overwrite
  mime_type TEXT NOT NULL,        -- e.g: "image/png", "application/pdf", "application/zip"
  size_bytes INTEGER NOT NULL,
  uploaded_by INTEGER REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

Design decisions to validate:

- **`stored_name` separate from `file_name`** — this is important, not just aesthetic. If two editors upload files named `diagram.png` on different pages (or even on the same one), without this field you have silent overwrite on disk. Generate `stored_name` with a UUID/hash + original extension (e.g: `crypto.randomUUID() + path.extname(originalName)`), keep the "nice" name only in `file_name` for UI display.
- **`ON DELETE CASCADE` on `page_id`** — this cleans the database row when a page is deleted, but doesn't delete the physical file from disk. This is a common trap: the record disappears from the DB, the file becomes orphaned in `uploads/`. You'll need, in your backend code (not in SQL), to delete the physical file before deleting the page — e.g: get all `attachments` for that page, `fs.unlink` each one, and only then delete the page (the cascade handles the rest of the rows). This is application logic, SQL alone doesn't solve it.
- **Relative path on disk** — I suggest organizing by page to facilitate organization and eventual manual cleanup: `uploads/{page_id}/{stored_name}`. That way if you need to audit/clean up manually someday, it's obvious what belongs to what.
