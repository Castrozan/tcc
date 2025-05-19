import { Equipment } from 'domain/entities/equipments/Equipment';
import { IEquipmentRepository } from 'domain/interfaces/equipments/IEquipmentRepository';
import { getDatabase } from '../../sqlite/sqlite-client';

/**
 * Interface for Equipment database row
 */
interface EquipmentRow {
    id: number;
    name: string;
    description: string | null;
    imageUrl: string | null;
    createdAt: string;
    type: string | null;
}

/**
 * SQLite repository implementation for the Equipment entity
 */
export class SQLiteEquipmentRepository implements IEquipmentRepository {
    async findById(id: number): Promise<Equipment | null> {
        const db = getDatabase();
        const row = db.prepare('SELECT * FROM Equipment WHERE id = ?').get(id) as
            | EquipmentRow
            | undefined;

        if (!row) {
            return null;
        }

        return new Equipment(
            row.id,
            row.name,
            row.description,
            row.imageUrl,
            new Date(row.createdAt),
            row.type
        );
    }

    async findAll(): Promise<Equipment[]> {
        const db = getDatabase();
        const rows = db.prepare('SELECT * FROM Equipment').all() as EquipmentRow[];

        return rows.map(
            (row) =>
                new Equipment(
                    row.id,
                    row.name,
                    row.description,
                    row.imageUrl,
                    new Date(row.createdAt),
                    row.type
                )
        );
    }

    async create(equipment: Partial<Equipment>): Promise<Equipment> {
        const db = getDatabase();
        const createdAt = new Date();

        const stmt = db.prepare(`
      INSERT INTO Equipment (name, description, imageUrl, createdAt, type)
      VALUES (?, ?, ?, ?, ?)
    `);

        const info = stmt.run(
            equipment.name,
            equipment.description,
            equipment.imageUrl,
            createdAt.toISOString(),
            equipment.type
        );

        const id = info.lastInsertRowid;

        return new Equipment(
            Number(id),
            equipment.name!,
            equipment.description || null,
            equipment.imageUrl || null,
            createdAt,
            equipment.type || null
        );
    }

    async update(equipment: Partial<Equipment>): Promise<Equipment> {
        if (!equipment.id) {
            throw new Error('Equipment ID is required for update');
        }

        const db = getDatabase();
        const stmt = db.prepare(`
      UPDATE Equipment
      SET name = ?, description = ?, imageUrl = ?, type = ?
      WHERE id = ?
    `);

        stmt.run(
            equipment.name,
            equipment.description,
            equipment.imageUrl,
            equipment.type,
            equipment.id
        );

        const updated = await this.findById(equipment.id);
        if (!updated) {
            throw new Error('Failed to retrieve updated equipment');
        }

        return updated;
    }

    async delete(id: number): Promise<void> {
        const db = getDatabase();
        db.prepare('DELETE FROM Equipment WHERE id = ?').run(id);
    }
}
