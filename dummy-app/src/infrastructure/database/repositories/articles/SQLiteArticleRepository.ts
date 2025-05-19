import { Article } from 'domain/entities/articles/Article';
import { ArticleImage } from 'domain/entities/articles/ArticleImage';
import { Professional } from 'domain/entities/professionals/Professional';
import { IArticleRepository } from 'domain/interfaces/articles/IArticleRepository';
import { getDatabase } from '../../sqlite/sqlite-client';

/**
 * Interfaces for database rows
 */
interface ArticleRow {
    id: number;
    title: string;
    description: string;
    bodyText: string;
    secondText: string;
    createdAt: string;
    updatedAt: string;
    professionalId: number | null;
    author: string | null;
    published: string | null;
}

interface ArticleImageRow {
    id: number;
    articleId: number;
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
 * SQLite repository implementation for the Article entity
 */
export class SQLiteArticleRepository implements IArticleRepository {
    async findById(id: number): Promise<Article | null> {
        const db = getDatabase();
        const row = db.prepare('SELECT * FROM Article WHERE id = ?').get(id) as
            | ArticleRow
            | undefined;

        if (!row) {
            return null;
        }

        // Get the related images
        const images = db
            .prepare('SELECT * FROM ArticleImage WHERE articleId = ?')
            .all(id) as ArticleImageRow[];

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

        // Map images to ArticleImage objects
        const articleImages = images.map(
            (img) => new ArticleImage(img.id, img.articleId, img.url, img.title, img.description)
        );

        return new Article(
            row.id,
            row.title,
            row.description,
            row.bodyText,
            row.secondText,
            new Date(row.createdAt),
            new Date(row.updatedAt),
            row.professionalId,
            row.author,
            row.published,
            articleImages,
            professional
        );
    }

    async findAll(): Promise<Article[]> {
        const db = getDatabase();
        const rows = db.prepare('SELECT * FROM Article').all() as ArticleRow[];

        // For each article, get images and professional
        return Promise.all(
            rows.map(async (row) => {
                return await this.findById(row.id);
            })
        ) as Promise<Article[]>;
    }

    async create(
        article: Partial<Article & { images?: Partial<ArticleImage>[] }>
    ): Promise<Article> {
        const db = getDatabase();
        const now = new Date();

        // Begin transaction
        db.prepare('BEGIN').run();

        try {
            // Insert the article
            const articleStmt = db.prepare(`
        INSERT INTO Article (title, description, bodyText, secondText, createdAt, updatedAt, professionalId, author, published)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

            const articleInfo = articleStmt.run(
                article.title,
                article.description,
                article.bodyText,
                article.secondText,
                now.toISOString(),
                now.toISOString(),
                article.professionalId,
                article.author,
                article.published
            );

            const articleId = Number(articleInfo.lastInsertRowid);

            // Insert images if provided
            if (article.images && article.images.length > 0) {
                const imageStmt = db.prepare(`
          INSERT INTO ArticleImage (articleId, url, title, description)
          VALUES (?, ?, ?, ?)
        `);

                for (const image of article.images) {
                    imageStmt.run(articleId, image.url, image.title, image.description);
                }
            }

            // Commit transaction
            db.prepare('COMMIT').run();

            // Return the created article with all data
            return this.findById(articleId) as Promise<Article>;
        } catch (error) {
            // Rollback on error
            db.prepare('ROLLBACK').run();
            console.error('Error creating article:', error);
            throw error;
        }
    }

    async update(
        article: Partial<Article & { images?: Partial<ArticleImage>[] }>
    ): Promise<Article> {
        if (!article.id) {
            throw new Error('Article ID is required for update');
        }

        const db = getDatabase();
        const now = new Date();

        // Begin transaction
        db.prepare('BEGIN').run();

        try {
            // Update the article
            const articleStmt = db.prepare(`
        UPDATE Article
        SET title = COALESCE(?, title),
            description = COALESCE(?, description),
            bodyText = COALESCE(?, bodyText),
            secondText = COALESCE(?, secondText),
            updatedAt = ?,
            professionalId = COALESCE(?, professionalId),
            author = COALESCE(?, author),
            published = COALESCE(?, published)
        WHERE id = ?
      `);

            articleStmt.run(
                article.title,
                article.description,
                article.bodyText,
                article.secondText,
                now.toISOString(),
                article.professionalId,
                article.author,
                article.published,
                article.id
            );

            // If images are provided, delete existing ones and insert new ones
            if (article.images) {
                // Delete existing images
                db.prepare('DELETE FROM ArticleImage WHERE articleId = ?').run(article.id);

                // Insert new images
                if (article.images.length > 0) {
                    const imageStmt = db.prepare(`
            INSERT INTO ArticleImage (articleId, url, title, description)
            VALUES (?, ?, ?, ?)
          `);

                    for (const image of article.images) {
                        imageStmt.run(article.id, image.url, image.title, image.description);
                    }
                }
            }

            // Commit transaction
            db.prepare('COMMIT').run();

            // Return the updated article
            return this.findById(article.id) as Promise<Article>;
        } catch (error) {
            // Rollback on error
            db.prepare('ROLLBACK').run();
            console.error('Error updating article:', error);
            throw error;
        }
    }

    async delete(id: number): Promise<void> {
        const db = getDatabase();

        // Begin transaction
        db.prepare('BEGIN').run();

        try {
            // Delete related images first (will be automatically handled by CASCADE constraint)
            db.prepare('DELETE FROM ArticleImage WHERE articleId = ?').run(id);

            // Delete the article
            db.prepare('DELETE FROM Article WHERE id = ?').run(id);

            // Commit transaction
            db.prepare('COMMIT').run();
        } catch (error) {
            // Rollback on error
            db.prepare('ROLLBACK').run();
            console.error('Error deleting article:', error);
            throw error;
        }
    }
}
