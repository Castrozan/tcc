import { CreateAboutUseCase } from 'application/use-cases/about/CreateAboutUseCase';
import { OpenAPIRoute } from 'chanfana';
import aboutRepository from 'infrastructure/database/repositories/about';
import { withErrorHandling } from 'presentation/decorators';
import { errorResponses, successResponse } from 'presentation/schemas/responses';
import { z } from 'zod';

export class CreateAboutController extends OpenAPIRoute {
    schema = {
        tags: ['Abouts'],
        summary: 'Create a new about',
        security: [{ bearerAuth: [] }],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: z.object({
                            bodyText: z.string().optional(),
                            secondText: z.string().optional(),
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
                description: 'About created successfully',
                content: {
                    'application/json': {
                        schema: z.object(
                            successResponse(
                                z.object({
                                    id: z.number(),
                                    bodyText: z.string().nullable(),
                                    secondText: z.string().nullable(),
                                    images: z
                                        .array(
                                            z.object({
                                                id: z.number(),
                                                aboutId: z.number(),
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

        const { bodyText, secondText, images } = data.body;

        const createAboutUseCase = new CreateAboutUseCase(aboutRepository);

        const about = await createAboutUseCase.execute({
            bodyText,
            secondText,
            images: images
                ? images.map((image) => ({
                      url: image.url,
                      title: image.title,
                      description: image.description
                  }))
                : null,
            createdAt: new Date()
        });

        return {
            success: true,
            result: {
                id: about.id,
                bodyText: about.bodyText,
                secondText: about.secondText,
                images: about.images,
                createdAt: about.createdAt.toISOString()
            }
        };
    }
}
