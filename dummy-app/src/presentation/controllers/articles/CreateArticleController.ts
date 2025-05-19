import { CreateArticleUseCase } from 'application/use-cases/articles/CreateArticleUseCase';
import { OpenAPIRoute } from 'chanfana';
import articleRepository from 'infrastructure/database/repositories/articles';
import { withErrorHandling } from 'presentation/decorators';
import { errorResponses, successResponse } from 'presentation/schemas/responses';
import { z } from 'zod';

export class CreateArticleController extends OpenAPIRoute {
    schema = {
        tags: ['Articles'],
        summary: 'Create a new article',
        security: [{ bearerAuth: [] }],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: z.object({
                            title: z.string().min(1, { message: 'Title is required' }),
                            description: z.string().optional(),
                            bodyText: z.string().optional(),
                            secondText: z.string().optional(),
                            professionalId: z.number().optional(),
                            author: z.string().optional(),
                            published: z.string().optional(),
                            images: z
                                .array(
                                    z.object({
                                        url: z.string().url({ message: 'Invalid URL' }).optional(),
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
            '201': {
                description: 'Article created successfully',
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
                                    professionalId: z.number().optional(),
                                    author: z.string().optional(),
                                    published: z.string().optional(),
                                    images: z
                                        .array(
                                            z.object({
                                                id: z.number(),
                                                researchId: z.number(),
                                                url: z.string().nullable(),
                                                title: z.string().nullable(),
                                                description: z.string().nullable()
                                            })
                                        )
                                        .nullable(),
                                    createdAt: z.string(),
                                    updatedAt: z.string()
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
            title,
            description,
            bodyText,
            secondText,
            professionalId,
            author,
            published,
            images
        } = data.body;

        const createArticleUseCase = new CreateArticleUseCase(articleRepository);

        const article = await createArticleUseCase.execute({
            title,
            description,
            bodyText,
            secondText,
            professionalId,
            author,
            published,
            images: images
                ? images.map((image) => ({
                      url: image.url,
                      title: image.title,
                      description: image.description
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
                professionalId: article.professionalId,
                images: article.images,
                createdAt: article.createdAt.toISOString(),
                updatedAt: article.updatedAt.toISOString()
            }
        };
    }
}
