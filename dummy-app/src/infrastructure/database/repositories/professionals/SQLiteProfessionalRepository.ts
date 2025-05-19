import { Professional } from 'domain/entities/professionals/Professional';
import { IProfessionalRepository } from 'domain/interfaces/professionals/IProfessionalRepository';
import { getDatabase } from '../../sqlite/sqlite-client';

/**
 * Interface for Professional database row
 */
interface ProfessionalRow {
    id: number;
    name: string;
    role: string;
    bio: string | null;
    imageUrl: string | null;
    createdAt: string;
    hierarchy: number;
}

export class SQLiteProfessionalRepository implements IProfessionalRepository {
    async findById(id: number): Promise<Professional | null> {
        const db = getDatabase();
        const row = db.prepare('SELECT * FROM Professional WHERE id = ?').get(id) as
            | ProfessionalRow
            | undefined;

        if (!row) {
            return null;
        }

        return new Professional(
            row.id,
            row.name,
            row.role,
            row.bio,
            row.imageUrl,
            new Date(row.createdAt),
            row.hierarchy
        );
    }

    async findAll(): Promise<Professional[]> {
        const db = getDatabase();
        const rows = db.prepare('SELECT * FROM Professional').all() as ProfessionalRow[];

        return rows.map(
            (row) =>
                new Professional(
                    row.id,
                    row.name,
                    row.role,
                    row.bio,
                    row.imageUrl,
                    new Date(row.createdAt),
                    row.hierarchy
                )
        );
    }

    async create(professional: Partial<Professional>): Promise<Professional> {
        const db = getDatabase();
        const createdAt = new Date();

        const stmt = db.prepare(`
            INSERT INTO Professional (name, role, bio, imageUrl, createdAt, hierarchy)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        const info = stmt.run(
            professional.name,
            professional.role,
            professional.bio,
            professional.imageUrl,
            createdAt.toISOString(),
            professional.hierarchy
        );

        const id = info.lastInsertRowid;

        return new Professional(
            Number(id),
            professional.name!,
            professional.role!,
            professional.bio ?? null,
            professional.imageUrl ?? null,
            createdAt,
            professional.hierarchy!
        );
    }

    async update(professional: Partial<Professional>): Promise<Professional> {
        if (!professional.id) {
            throw new Error('Professional ID is required for update');
        }

        const db = getDatabase();
        const stmt = db.prepare(`
            UPDATE Professional
            SET name = ?, role = ?, bio = ?, imageUrl = ?, hierarchy = ?
            WHERE id = ?
        `);

        stmt.run(
            professional.name,
            professional.role,
            professional.bio,
            professional.imageUrl,
            professional.hierarchy,
            professional.id
        );

        const updated = await this.findById(professional.id);
        if (!updated) {
            throw new Error('Failed to retrieve updated professional');
        }

        return updated;
    }

    async delete(id: number): Promise<void> {
        const db = getDatabase();
        db.prepare('DELETE FROM Professional WHERE id = ?').run(id);
    }
}
