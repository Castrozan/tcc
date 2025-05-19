import { FindByIdArticleUseCase } from 'application/use-cases/articles/FindByIdArticleUseCase';
import { Bool, OpenAPIRoute } from 'chanfana';
import articleRepository from 'infrastructure/database/repositories/articles';
import { withErrorHandling } from 'presentation/decorators';
import { z } from 'zod';

export class FindByIdArticleController extends OpenAPIRoute {
    schema = {
        tags: ['Articles'],
        summary: 'Retrieve an article by ID',
        parameters: [
            {
                name: 'id',
                in: 'path' as const,
                required: true,
                schema: {
                    type: 'integer' as const
                },
                description: 'ID of the article to retrieve'
            }
        ],
        responses: {
            '200': {
                description: 'Article retrieved successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            success: Bool(),
                            result: z
                                .object({
                                    id: z.number(),
                                    title: z.string(),
                                    description: z.string(),
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
                                            email: z.string(),
                                            password: z.string(),
                                            role: z.string()
                                        })
                                        .nullable()
                                })
                                .nullable()
                        })
                    }
                }
            },
            '400': {
                description: 'Failed to retrieve article',
                content: {
                    'application/json': {
                        schema: z.object({
                            success: Bool(),
                            message: z.string()
                        })
                    }
                }
            },
            '500': {
                description: 'Server error',
                content: {
                    'application/json': {
                        schema: z.object({
                            success: Bool(),
                            message: z.string()
                        })
                    }
                }
            }
        }
    };

    @withErrorHandling
    async handle(req: { params: { id: number } }): Promise<object> {
        const { id } = req.params;

        const findByIdArticleUseCase = new FindByIdArticleUseCase(articleRepository);
        const article = await findByIdArticleUseCase.execute(id);

        if (!article) {
            return {
                success: false,
                message: 'Article not found'
            };
        }

        return {
            success: true,
            result: {
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
                          articleId: image.articleId,
                          url: image.url,
                          title: image.title,
                          description: image.description
                      }))
                    : null,
                professional: article.professional ? article.professional : null
            }
        };
    }
}
