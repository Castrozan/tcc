import { IArticleRepository } from 'domain/interfaces/articles/IArticleRepository';
import { SQLiteArticleRepository } from './SQLiteArticleRepository';

const ArticleRepository: IArticleRepository = new SQLiteArticleRepository();

export default ArticleRepository;
