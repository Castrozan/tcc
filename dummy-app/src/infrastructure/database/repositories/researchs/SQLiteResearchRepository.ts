import { Research } from 'domain/entities/researchs/Research';
import { ResearchImage } from 'domain/entities/researchs/ResearchImage';
import { Professional } from 'domain/entities/professionals/Professional';
import { IResearchRepository } from 'domain/interfaces/researchs/IResearchRepository';
import { getDatabase } from '../../sqlite/sqlite-client';

/**
 * Interfaces for database rows
 */
interface ResearchRow {
    id: number;
    title: string;
    description: string;
    bodyText: string;
    secondText: string;
    createdAt: string;
    updatedAt: string;
    professionalId: number | null;
}

interface ResearchImageRow {
    id: number;
    researchId: number;
    url: string | null;
    title: string | null;
    description: string | null;
}

interface ProfessionalRow {
    id: number;
    name: string;
    role: string;
    bio: string | null;
    imageUrl: string | null;
    createdAt: string;
    hierarchy: number;
}

/**
 * SQLite repository implementation for the Research entity
 */
export class SQLiteResearchRepository implements IResearchRepository {
    async findById(id: number): Promise<Research | null> {
        const db = getDatabase();
        const row = db.prepare('SELECT * FROM Research WHERE id = ?').get(id) as
            | ResearchRow
            | undefined;

        if (!row) {
            return null;
        }

        // Get the related images
        const images = db
            .prepare('SELECT * FROM ResearchImage WHERE researchId = ?')
            .all(id) as ResearchImageRow[];

        // Get related professional if exists
        let professional: Professional | null = null;
        if (row.professionalId) {
            const profRow = db
                .prepare('SELECT * FROM Professional WHERE id = ?')
                .get(row.professionalId) as ProfessionalRow | undefined;
            if (profRow) {
                professional = new Professional(
                    profRow.id,
                    profRow.name,
                    profRow.role,
                    profRow.bio,
                    profRow.imageUrl,
                    new Date(profRow.createdAt),
                    profRow.hierarchy
                );
            }
        }

        // Map images to ResearchImage objects
        const researchImages = images.map(
            (img) => new ResearchImage(img.id, img.researchId, img.url, img.title, img.description)
        );

        return new Research(
            row.id,
            row.title,
            row.description,
            row.bodyText,
            row.secondText,
            new Date(row.createdAt),
            new Date(row.updatedAt),
            row.professionalId,
            researchImages,
            professional
        );
    }

    async findAll(): Promise<Research[]> {
        const db = getDatabase();
        const rows = db.prepare('SELECT * FROM Research').all() as ResearchRow[];

        // For each research, get images and professional
        return Promise.all(
            rows.map(async (row) => {
                return await this.findById(row.id);
            })
        ) as Promise<Research[]>;
    }

    async create(
        research: Partial<Research & { image?: Partial<ResearchImage>[] }>
    ): Promise<Research> {
        const db = getDatabase();
        const now = new Date();

        // Begin transaction
        db.prepare('BEGIN').run();

        try {
            // Insert the research
            const researchStmt = db.prepare(`
        INSERT INTO Research (title, description, bodyText, secondText, createdAt, updatedAt, professionalId)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

            const researchInfo = researchStmt.run(
                research.title,
                research.description,
                research.bodyText,
                research.secondText,
                now.toISOString(),
                now.toISOString(),
                research.professionalId
            );

            const researchId = Number(researchInfo.lastInsertRowid);

            // Insert images if provided
            if (research.image && research.image.length > 0) {
                const imageStmt = db.prepare(`
          INSERT INTO ResearchImage (researchId, url, title, description)
          VALUES (?, ?, ?, ?)
        `);

                for (const image of research.image) {
                    imageStmt.run(researchId, image.url, image.title, image.description);
                }
            }

            // Commit transaction
            db.prepare('COMMIT').run();

            // Return the created research with all data
            return this.findById(researchId) as Promise<Research>;
        } catch (error) {
            // Rollback on error
            db.prepare('ROLLBACK').run();
            console.error('Error creating research:', error);
            throw error;
        }
    }

    async update(
        research: Partial<Research & { image?: Partial<ResearchImage>[] }>
    ): Promise<Research> {
        if (!research.id) {
            throw new Error('Research ID is required for update');
        }

        const db = getDatabase();
        const now = new Date();

        // Begin transaction
        db.prepare('BEGIN').run();

        try {
            // Update the research
            const researchStmt = db.prepare(`
        UPDATE Research
        SET title = COALESCE(?, title),
            description = COALESCE(?, description),
            bodyText = COALESCE(?, bodyText),
            secondText = COALESCE(?, secondText),
            updatedAt = ?,
            professionalId = COALESCE(?, professionalId)
        WHERE id = ?
      `);

            researchStmt.run(
                research.title,
                research.description,
                research.bodyText,
                research.secondText,
                now.toISOString(),
                research.professionalId,
                research.id
            );

            // If images are provided, delete existing ones and insert new ones
            if (research.image) {
                // Delete existing images
                db.prepare('DELETE FROM ResearchImage WHERE researchId = ?').run(research.id);

                // Insert new images
                if (research.image.length > 0) {
                    const imageStmt = db.prepare(`
            INSERT INTO ResearchImage (researchId, url, title, description)
            VALUES (?, ?, ?, ?)
          `);

                    for (const image of research.image) {
                        imageStmt.run(research.id, image.url, image.title, image.description);
                    }
                }
            }

            // Commit transaction
            db.prepare('COMMIT').run();

            // Return the updated research
            return this.findById(research.id) as Promise<Research>;
        } catch (error) {
            // Rollback on error
            db.prepare('ROLLBACK').run();
            console.error('Error updating research:', error);
            throw error;
        }
    }

    async delete(id: number): Promise<void> {
        const db = getDatabase();

        // Begin transaction
        db.prepare('BEGIN').run();

        try {
            // Delete related images first (will be automatically handled by CASCADE constraint)
            db.prepare('DELETE FROM ResearchImage WHERE researchId = ?').run(id);

            // Delete the research
            db.prepare('DELETE FROM Research WHERE id = ?').run(id);

            // Commit transaction
            db.prepare('COMMIT').run();
        } catch (error) {
            // Rollback on error
            db.prepare('ROLLBACK').run();
            console.error('Error deleting research:', error);
            throw error;
        }
    }
}
