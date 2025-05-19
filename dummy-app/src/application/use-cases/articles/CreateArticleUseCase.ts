import { CreateArticleDto } from 'application/dtos/articles/CreateArticleDto';
import { Article } from 'domain/entities/articles/Article';
import { IArticleRepository } from 'domain/interfaces/articles/IArticleRepository';

export class CreateArticleUseCase {
    constructor(private articleRepository: IArticleRepository) {}

    async execute(dto: CreateArticleDto): Promise<Article> {
        if (!dto) {
            throw new Error('Article not found');
        }

        return this.articleRepository.create({
            ...dto,
            images: dto.images?.map((image) => ({
                ...image,
                id: undefined,
                articleId: undefined
            }))
        });
    }
}
