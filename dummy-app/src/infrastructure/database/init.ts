import { initializeDatabase as initializeSQLite } from './sqlite/migrations';
import { closeDatabase, getDatabase } from './sqlite/sqlite-client';

export async function initializeDatabase(): Promise<void> {
    try {
        initializeSQLite();

        // Verify connection
        const db = getDatabase();
        const result = db.prepare('SELECT 1 AS test').get() as { test: number };
        if (result && result.test === 1) {
            console.log('Database connection successful');
        }
    } catch (error) {
        console.error('SQLite initialization failed:', error);
        throw error;
    }
}

export function cleanupDatabase(): void {
    closeDatabase();
    console.log('Database connection closed');
}
