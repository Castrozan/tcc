import { UpdateArticleUseCase } from 'application/use-cases/articles/UpdateArticleUseCase';
import { OpenAPIRoute } from 'chanfana';
import articleRepository from 'infrastructure/database/repositories/articles';
import { withErrorHandling } from 'presentation/decorators';
import { errorResponses, successResponse } from 'presentation/schemas/responses';
import { z } from 'zod';

export class UpdateArticleController extends OpenAPIRoute {
    schema = {
        tags: ['Articles'],
        summary: 'Update an existing article',
        security: [{ bearerAuth: [] }],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: z.object({
                            id: z.number().min(1, { message: 'ID is required' }),
                            title: z.string().min(1, { message: 'Title is required' }),
                            description: z.string().optional(),
                            bodyText: z.string().optional(),
                            secondText: z.string().optional(),
                            professionalId: z.number().nullable().optional(),
                            author: z.string().nullable().optional(),
                            published: z.string().nullable().optional(),
                            images: z
                                .array(
                                    z.object({
                                        id: z.number().nullable().optional(),
                                        articleId: z.number().nullable().optional(),
                                        url: z
                                            .string()
                                            .url({ message: 'Invalid URL' })
                                            .nonempty({ message: 'URL is required' }),
                                        title: z.string().optional(),
                                        description: z.string().optional()
                                    })
                                )
                                .optional()
                        })
                    }
                }
            }
        },
        responses: {
            '200': {
                description: 'Article updated successfully',
                content: {
                    'application/json': {
                        schema: z.object(
                            successResponse(
                                z.object({
                                    id: z.number(),
                                    title: z.string(),
                                    description: z.string().nullable(),
                                    bodyText: z.string().nullable(),
                                    secondText: z.string().nullable(),
                                    createdAt: z.string(),
                                    updatedAt: z.string(),
                                    professionalId: z.number().nullable(),
                                    author: z.string().nullable().optional(),
                                    published: z.string().nullable().optional(),
                                    images: z
                                        .array(
                                            z.object({
                                                id: z.number().nullable(),
                                                url: z.string().nullable(),
                                                title: z.string().nullable(),
                                                description: z.string().nullable(),
                                                articleId: z.number().nullable()
                                            })
                                        )
                                        .nullable()
                                })
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
        const data = await this.getValidatedData<typeof this.schema>();

        const {
            id,
            title,
            description,
            bodyText,
            secondText,
            professionalId,
            author,
            published,
            images
        } = data.body;

        const updateArticleUseCase = new UpdateArticleUseCase(articleRepository);

        const article = await updateArticleUseCase.execute({
            id,
            title,
            description,
            bodyText,
            secondText,
            professionalId,
            author,
            published,
            images: images
                ? images.map((image) => ({
                      id: image.id,
                      url: image.url,
                      title: image.title,
                      description: image.description,
                      articleId: image.articleId
                  }))
                : null
        });

        return {
            success: true,
            result: {
                id: article.id,
                title: article.title,
                description: article.description,
                bodyText: article.bodyText,
                secondText: article.secondText,
                author: article.author,
                professionalId: article.professionalId,
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
                createdAt: article.createdAt.toISOString(),
                updatedAt: article.updatedAt.toISOString()
            }
        };
    }
}
