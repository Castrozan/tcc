import { getDatabase } from './sqlite-client';

/**
 * Initialize the SQLite database schema
 * Creates all necessary tables if they don't exist.
 */
export function initializeDatabase(): void {
    const db = getDatabase();

    // Create tables
    db.exec(`
    -- Create Equipment table
    -- Stores information about equipment available in the institution
    CREATE TABLE IF NOT EXISTS Equipment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,                         -- Equipment name
      description TEXT,                           -- Equipment description
      imageUrl TEXT,                              -- Equipment image URL
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      type TEXT                                   -- Equipment type/category
    );
  `);
}
