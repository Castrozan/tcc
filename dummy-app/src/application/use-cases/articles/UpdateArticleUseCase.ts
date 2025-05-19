import { UpdateArticleDto } from 'application/dtos/articles/UpdateArticleDto';
import { Article } from 'domain/entities/articles/Article';
import { ArticleImage } from 'domain/entities/articles/ArticleImage';
import { IArticleRepository } from 'domain/interfaces/articles/IArticleRepository';

export class UpdateArticleUseCase {
    constructor(private articleRepository: IArticleRepository) {}

    async execute(dto: UpdateArticleDto): Promise<Article> {
        const articleToUpdate: Partial<Article & { images?: Partial<ArticleImage>[] }> = {
            ...dto,
            images: dto.images?.map((image) => ({
                ...image,
                articleId: dto.id
            }))
        };
        return this.articleRepository.update(articleToUpdate);
    }
}
