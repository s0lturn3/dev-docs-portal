import sqlite3 from 'sqlite3';

const DBSOURCE = 'database.db';

const COMMANDS = {
  users: `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`,
  categories: `CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    parent_id INTEGER REFERENCES categories(id) ON DELETE CASCADE, -- allows sub-categories
    sort_order INTEGER NOT NULL DEFAULT 0
  );`,
  pages: `CREATE TABLE IF NOT EXISTS pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content_md TEXT NOT NULL,          -- the markdown content itself
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`,
  tags: `CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );`,
  page_tags: `CREATE TABLE IF NOT EXISTS page_tags (
    page_id INTEGER NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (page_id, tag_id)
  );`,
  attachments: `CREATE TABLE IF NOT EXISTS attachments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_id INTEGER NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,        -- original filename submitted by user (e.g: "diagram-auth.png")
    stored_name TEXT NOT NULL UNIQUE, -- actual filename on disk (e.g: "a1b2c3d4.png") - avoids collision/overwrite
    mime_type TEXT NOT NULL,        -- e.g: "image/png", "application/pdf", "application/zip"
    size_bytes INTEGER NOT NULL,
    uploaded_by INTEGER REFERENCES users(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`
}


// 1. Initialize the db connection
const database = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  }
  else console.log('Database connected successfully.');
});

// 2. Creates the tables
database.serialize(() => {
  // Table 1: users
  database.run(COMMANDS.users, (err) => {
    if (err) console.error('An error occurred while creating the `users` table: ', err);
    else console.log('Table `users` created successfully.');
  });
  
  // Table 2: categories
  database.run(COMMANDS.categories, (err) => {
    if (err) console.error('An error occurred while creating the `categories` table: ', err);
    else console.log('Table `categories` created successfully.');
  });

  // Table 3: pages
  database.run(COMMANDS.pages, (err) => {
    if (err) console.error('An error occurred while creating the `pages` table: ', err);
    else console.log('Table `pages` created successfully.');
  });

  // Table 4: tags
  database.run(COMMANDS.tags, (err) => {
    if (err) console.error('An error occurred while creating the `tags` table: ', err);
    else console.log('Table `tags` created successfully.');
  });

  // Table 5: page_tags
  database.run(COMMANDS.page_tags, (err) => {
    if (err) console.error('An error occurred while creating the `page_tags` table: ', err);
    else console.log('Table `page_tags` created successfully.');
  });

  // Table 6: attachments
  database.run(COMMANDS.attachments, (err) => {
    if (err) console.error('An error occurred while creating the `attachments` table: ', err);
    else console.log('Table `attachments` created successfully.');
  });

  console.log('\nAll tables created successfully.');
});

export default database;