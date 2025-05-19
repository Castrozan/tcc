import { CreateResearchUseCase } from 'application/use-cases/researchs/CreateResearchUseCase';
import { OpenAPIRoute } from 'chanfana';
import researchRepository from 'infrastructure/database/repositories/researchs';
import { withErrorHandling } from 'presentation/decorators';
import { errorResponses, successResponse } from 'presentation/schemas/responses';
import { z } from 'zod';

export class CreateResearchController extends OpenAPIRoute {
    schema = {
        tags: ['Researchs'],
        summary: 'Create a new Research',
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
                description: 'Research created successfully',
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

        const { title, description, bodyText, secondText, professionalId, images } = data.body;

        const createResearchUseCase = new CreateResearchUseCase(researchRepository);

        const research = await createResearchUseCase.execute({
            title,
            description,
            bodyText,
            secondText,
            professionalId,
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
                id: research.id,
                title: research.title,
                description: research.description,
                bodyText: research.bodyText,
                secondText: research.secondText,
                images: research.image,
                createdAt: research.createdAt.toISOString(),
                updatedAt: research.updatedAt.toISOString()
            }
        };
    }
}
