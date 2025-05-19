import { FindAllResearchUseCase } from 'application/use-cases/researchs/FindAllResearchUseCase';
import { Bool, OpenAPIRoute } from 'chanfana';
import researchRepository from 'infrastructure/database/repositories/researchs';
import { z } from 'zod';

export class FindAllResearchController extends OpenAPIRoute {
    schema = {
        tags: ['Researchs'],
        summary: 'Retrieve all research',
        responses: {
            '200': {
                description: 'List of research retrieved successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            success: Bool(),
                            result: z.array(
                                z.object({
                                    id: z.number(),
                                    title: z.string(),
                                    description: z.string().nullable(),
                                    bodyText: z.string(),
                                    secondText: z.string(),
                                    createdAt: z.string(),
                                    updatedAt: z.string(),
                                    professionalId: z.number().nullable(),
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
                                            role: z.string()
                                        })
                                        .nullable()
                                })
                            )
                        })
                    }
                }
            },
            '400': {
                description: 'Failed to retrieve research',
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

    async handle(): Promise<object> {
        try {
            const findAllResearchUseCase = new FindAllResearchUseCase(researchRepository);
            const researchList = await findAllResearchUseCase.execute();

            return {
                success: true,
                result: researchList.map((research) => ({
                    id: research.id,
                    title: research.title,
                    description: research.description,
                    bodyText: research.bodyText,
                    secondText: research.secondText,
                    createdAt: research.createdAt.toISOString(),
                    updatedAt: research.updatedAt.toISOString(),
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
                    professional: research.professional
                        ? {
                              id: research.professional.id,
                              name: research.professional.name,
                              role: research.professional.role
                          }
                        : null
                }))
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to retrieve research'
            };
        }
    }
}
