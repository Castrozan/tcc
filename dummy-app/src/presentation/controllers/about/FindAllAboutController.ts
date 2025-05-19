import { FindAllAboutsUseCase } from 'application/use-cases/about/FindAllAboutUseCase';
import { OpenAPIRoute } from 'chanfana';
import aboutRepository from 'infrastructure/database/repositories/about';
import { withErrorHandling } from 'presentation/decorators';
import { errorResponses, successResponse } from 'presentation/schemas/responses';
import { z } from 'zod';

export class FindAllAboutController extends OpenAPIRoute {
    schema = {
        tags: ['Abouts'],
        summary: 'Retrieve all abouts',
        responses: {
            '200': {
                description: 'List of abouts retrieved successfully',
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
                                                email: z.string(),
                                                password: z.string(),
                                                role: z.string()
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
        const findAllAboutUseCase = new FindAllAboutsUseCase(aboutRepository);
        const abouts = await findAllAboutUseCase.execute();

        return {
            success: true,
            result: abouts.map((about) => ({
                id: about.id,
                bodyText: about.bodyText,
                secondText: about.secondText,
                createdAt: about.createdAt.toISOString(),
                images: about.images
                    ? about.images.map((image) => ({
                          id: image.id,
                          researchId: image.aboutId,
                          url: image.url,
                          title: image.title,
                          description: image.description
                      }))
                    : null
            }))
        };
    }
}
