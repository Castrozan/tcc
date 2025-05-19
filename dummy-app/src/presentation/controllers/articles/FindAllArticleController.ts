import { FindAllArticlesUseCase } from 'application/use-cases/articles/FindAllArticleUseCase';
import { OpenAPIRoute } from 'chanfana';
import articleRepository from 'infrastructure/database/repositories/articles';
import { withErrorHandling } from 'presentation/decorators';
import { errorResponses, successResponse } from 'presentation/schemas/responses';
import { z } from 'zod';

export class FindAllArticleController extends OpenAPIRoute {
    schema = {
        tags: ['Articles'],
        summary: 'Retrieve all articles',
        responses: {
            '200': {
                description: 'List of articles retrieved successfully',
                content: {
                    'application/json': {
                        schema: z.object(
                            successResponse(
                                z.array(
                                    z.object({
                                        id: z.number(),
                                        title: z.string(),
                                        description: z.string().nullable(),
                                        bodyText: z.string(),
                                        secondText: z.string(),
                                        createdAt: z.string(),
                                        updatedAt: z.string(),
                                        professionalId: z.number().nullable(),
                                        author: z.string().nullable(),
                                        published: z.string().nullable(),
                                        images: z
                                            .array(
                                                z.object({
                                                    id: z.number().nullable(),
                                                    researchId: z.number().nullable(),
                                                    url: z.string().nullable(),
                                                    title: z.string().nullable(),
                                                    description: z.string().nullable()
                                                })
                                            )
                                            .nullable(),
                                        professional: z
                                            .object({
                                                id: z.number(),
                                                name: z.string(),
                                                role: z.string(),
                                                bio: z.string().nullable(),
                                                imageUrl: z.string().nullable(),
                                                hierarchy: z.number().nullable()
                                            })
                                            .nullable()
                                    })
                                )
                            )
                        )
                    }
                }
            },
            ...errorResponses
        }
    };

    @withErrorHandling
    async handle(): Promise<object> {
        const findAllArticlesUseCase = new FindAllArticlesUseCase(articleRepository);
        const articles = await findAllArticlesUseCase.execute();

        return {
            success: true,
            result: articles.map((article) => ({
                id: article.id,
                title: article.title,
                description: article.description,
                bodyText: article.bodyText,
                secondText: article.secondText,
                createdAt: article.createdAt.toISOString(),
                updatedAt: article.updatedAt.toISOString(),
                professionalId: article.professionalId,
                author: article.author,
                published: article.published,
                images: article.images
                    ? article.images.map((image) => ({
                          id: image.id,
                          researchId: image.articleId,
                          url: image.url,
                          title: image.title,
                          description: image.description
                      }))
                    : null,
                professional: article.professional
                    ? {
                          id: article.professional.id,
                          name: article.professional.name,
                          bio: article.professional.bio,
                          hierarchy: article.professional.hierarchy,
                          imageUrl: article.professional.imageUrl,
                          role: article.professional.role
                      }
                    : null
            }))
        };
    }
}
