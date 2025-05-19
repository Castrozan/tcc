import { UpdateResearchUseCase } from 'application/use-cases/researchs/UpdateResearchUseCase';
import { OpenAPIRoute } from 'chanfana';
import researchRepository from 'infrastructure/database/repositories/researchs';
import { withErrorHandling } from 'presentation/decorators';
import { errorResponses, successResponse } from 'presentation/schemas/responses';
import { z } from 'zod';

export class UpdateResearchController extends OpenAPIRoute {
    schema = {
        tags: ['Researchs'],
        summary: 'Update an existing research',
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
                            images: z
                                .array(
                                    z.object({
                                        id: z.number().nullable().optional(),
                                        researchId: z.number().nullable().optional(),
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
                description: 'Research updated successfully',
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
                                    professionalId: z.number().nullable(),
                                    images: z
                                        .array(
                                            z.object({
                                                id: z.number().nullable(),
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

        const { id, title, description, bodyText, secondText, professionalId, images } = data.body;

        const updateResearchUseCase = new UpdateResearchUseCase(researchRepository);

        const research = await updateResearchUseCase.execute({
            id,
            title,
            description,
            bodyText,
            secondText,
            professionalId,
            images: images
                ? images.map((image) => ({
                      id: image.id,
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
                professionalId: research.professionalId,
                images: research.image
                    ? research.image.map((image) => ({
                          id: image.id,
                          researchId: image.researchId,
                          url: image.url,
                          title: image.title,
                          description: image.description
                      }))
                    : null,
                createdAt: research.createdAt.toISOString(),
                updatedAt: research.updatedAt.toISOString()
            }
        };
    }
}
