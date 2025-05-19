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

    -- Create Article table
    -- Stores academic articles with their content and metadata
    CREATE TABLE IF NOT EXISTS Article (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,                        -- Article title
      description TEXT NOT NULL,                  -- Short description
      bodyText TEXT NOT NULL,                     -- Main content
      secondText TEXT NOT NULL,                   -- Secondary content
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      professionalId INTEGER,                     -- Author reference
      author TEXT,                                -- Author name (when not in Professional table)
      published TEXT,                             -- Publication date or status
      FOREIGN KEY (professionalId) REFERENCES Professional(id) ON DELETE SET NULL
    );

    -- Create ArticleImage table
    -- Stores images associated with articles
    CREATE TABLE IF NOT EXISTS ArticleImage (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      articleId INTEGER,                          -- Related article
      url TEXT,                                   -- Image URL
      title TEXT,                                 -- Image title
      description TEXT,                           -- Image description
      FOREIGN KEY (articleId) REFERENCES Article(id) ON DELETE CASCADE
    );

    -- Create Research table
    -- Stores research projects information
    CREATE TABLE IF NOT EXISTS Research (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,                        -- Research title
      description TEXT NOT NULL,                  -- Short description
      bodyText TEXT NOT NULL,                     -- Main content
      secondText TEXT NOT NULL,                   -- Secondary content
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      professionalId INTEGER,                     -- Lead researcher reference
      FOREIGN KEY (professionalId) REFERENCES Professional(id) ON DELETE SET NULL
    );

    -- Create ResearchImage table
    -- Stores images associated with research projects
    CREATE TABLE IF NOT EXISTS ResearchImage (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      researchId INTEGER,                         -- Related research
      url TEXT,                                   -- Image URL
      title TEXT,                                 -- Image title
      description TEXT,                           -- Image description
      FOREIGN KEY (researchId) REFERENCES Research(id) ON DELETE CASCADE
    );

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
    
    -- Create About table
    -- Stores institutional information for the "About Us" section
    CREATE TABLE IF NOT EXISTS About (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bodyText TEXT NOT NULL,                     -- Main content
      secondText TEXT,                            -- Secondary content
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Create AboutImage table
    -- Stores images for the "About Us" section
    CREATE TABLE IF NOT EXISTS AboutImage (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      aboutId INTEGER,                            -- Related About entry
      url TEXT,                                   -- Image URL
      title TEXT,                                 -- Image title
      description TEXT,                           -- Image description
      FOREIGN KEY (aboutId) REFERENCES About(id) ON DELETE CASCADE
    );
  `);
}
