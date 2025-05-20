import { getDatabase } from './sqlite-client';

/**
 * Initialize the SQLite database schema
 * Creates all necessary tables if they don't exist.
 */
export function initializeDatabase(): void {
    const db = getDatabase();

    // Create tables
    db.exec(`
    -- Create Professional table
    -- Stores information about professionals associated with the institution
    CREATE TABLE IF NOT EXISTS Professional (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,                         -- Professional's name
      role TEXT NOT NULL,                         -- Role in the institution
      bio TEXT,                                   -- Professional's biography
      imageUrl TEXT,                              -- URL to professional's image
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      hierarchy INTEGER                           -- Used for display order
    );
  `);
}
