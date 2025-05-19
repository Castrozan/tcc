import { ArticleImage } from 'domain/entities/articles/ArticleImage';
import { Article } from '../../entities/articles/Article';

export interface IArticleRepository {
    create(article: Partial<Article & { images?: Partial<ArticleImage>[] }>): Promise<Article>;
    findById(id: number): Promise<Article | null>;
    findAll(): Promise<Article[]>;
    update(article: Partial<Article & { images?: Partial<ArticleImage>[] }>): Promise<Article>;
    delete(id: number): Promise<void>;
}
