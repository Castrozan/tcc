import { About } from 'domain/entities/about/About';
import { AboutImage } from 'domain/entities/about/AboutImage';
import { IAboutRepository } from 'domain/interfaces/about/IAboutRepository';
import { getDatabase } from '../../sqlite/sqlite-client';

/**
 * Interfaces for database rows
 */
interface AboutRow {
    id: number;
    bodyText: string;
    secondText: string;
    createdAt: string;
}

interface AboutImageRow {
    id: number;
    aboutId: number;
    url: string | null;
    title: string | null;
    description: string | null;
}

/**
 * SQLite repository implementation for the About entity
 */
export class SQLiteAboutRepository implements IAboutRepository {
    async findById(id: number): Promise<About | null> {
        const db = getDatabase();
        const row = db.prepare('SELECT * FROM About WHERE id = ?').get(id) as AboutRow | undefined;

        if (!row) {
            return null;
        }

        // Get the related images
        const images = db
            .prepare('SELECT * FROM AboutImage WHERE aboutId = ?')
            .all(id) as AboutImageRow[];

        // Map images to AboutImage objects
        const aboutImages = images.map(
            (img) => new AboutImage(img.id, img.aboutId, img.url, img.title, img.description)
        );

        return new About(
            row.id,
            row.bodyText,
            row.secondText,
            new Date(row.createdAt),
            aboutImages
        );
    }

    async findAll(): Promise<About[]> {
        const db = getDatabase();
        const rows = db.prepare('SELECT * FROM About').all() as AboutRow[];

        // For each about, get images
        return Promise.all(
            rows.map(async (row) => {
                return await this.findById(row.id);
            })
        ) as Promise<About[]>;
    }

    async create(about: Partial<About & { images?: Partial<AboutImage>[] }>): Promise<About> {
        const db = getDatabase();
        const now = new Date();

        // Begin transaction
        db.prepare('BEGIN').run();

        try {
            // Insert the about entry
            const aboutStmt = db.prepare(`
        INSERT INTO About (bodyText, secondText, createdAt)
        VALUES (?, ?, ?)
      `);

            const aboutInfo = aboutStmt.run(about.bodyText, about.secondText, now.toISOString());

            const aboutId = Number(aboutInfo.lastInsertRowid);

            // Insert images if provided
            if (about.images && about.images.length > 0) {
                const imageStmt = db.prepare(`
          INSERT INTO AboutImage (aboutId, url, title, description)
          VALUES (?, ?, ?, ?)
        `);

                for (const image of about.images) {
                    imageStmt.run(aboutId, image.url, image.title, image.description);
                }
            }

            // Commit transaction
            db.prepare('COMMIT').run();

            // Return the created about with all data
            return this.findById(aboutId) as Promise<About>;
        } catch (error) {
            // Rollback on error
            db.prepare('ROLLBACK').run();
            console.error('Error creating about:', error);
            throw error;
        }
    }

    async update(about: Partial<About & { images?: Partial<AboutImage>[] }>): Promise<About> {
        if (!about.id) {
            throw new Error('About ID is required for update');
        }

        const db = getDatabase();

        // Begin transaction
        db.prepare('BEGIN').run();

        try {
            // Update the about entry
            const aboutStmt = db.prepare(`
        UPDATE About
        SET bodyText = COALESCE(?, bodyText),
            secondText = COALESCE(?, secondText)
        WHERE id = ?
      `);

            aboutStmt.run(about.bodyText, about.secondText, about.id);

            // If images are provided, delete existing ones and insert new ones
            if (about.images) {
                // Delete existing images
                db.prepare('DELETE FROM AboutImage WHERE aboutId = ?').run(about.id);

                // Insert new images
                if (about.images.length > 0) {
                    const imageStmt = db.prepare(`
            INSERT INTO AboutImage (aboutId, url, title, description)
            VALUES (?, ?, ?, ?)
          `);

                    for (const image of about.images) {
                        imageStmt.run(about.id, image.url, image.title, image.description);
                    }
                }
            }

            // Commit transaction
            db.prepare('COMMIT').run();

            // Return the updated about
            return this.findById(about.id) as Promise<About>;
        } catch (error) {
            // Rollback on error
            db.prepare('ROLLBACK').run();
            console.error('Error updating about:', error);
            throw error;
        }
    }

    async delete(id: number): Promise<void> {
        const db = getDatabase();

        // Begin transaction
        db.prepare('BEGIN').run();

        try {
            // Delete related images first (will be automatically handled by CASCADE constraint)
            db.prepare('DELETE FROM AboutImage WHERE aboutId = ?').run(id);

            // Delete the about entry
            db.prepare('DELETE FROM About WHERE id = ?').run(id);

            // Commit transaction
            db.prepare('COMMIT').run();
        } catch (error) {
            // Rollback on error
            db.prepare('ROLLBACK').run();
            console.error('Error deleting about:', error);
            throw error;
        }
    }
}
