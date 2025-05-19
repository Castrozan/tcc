// application/use-case/FindAllArticlesUseCase.ts
import { Article } from 'domain/entities/articles/Article';
import { IArticleRepository } from 'domain/interfaces/articles/IArticleRepository';

export class FindAllArticlesUseCase {
    constructor(private articleRepository: IArticleRepository) {}

    async execute(): Promise<Article[]> {
        return this.articleRepository.findAll();
    }
}
