import { FindAllProfessionalUseCase } from 'application/use-cases/professionals/FindAllProfessionalUseCase';
import { Bool, OpenAPIRoute } from 'chanfana';
import professionalRepository from 'infrastructure/database/repositories/professionals';
import { withErrorHandling } from 'presentation/decorators';
import { z } from 'zod';

export class FindAllProfessionalController extends OpenAPIRoute {
    schema = {
        tags: ['Professionals'],
        summary: 'Retrieve all professionals',
        responses: {
            '200': {
                description: 'List of professionals retrieved successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            success: Bool(),
                            result: z.array(
                                z.object({
                                    id: z.number(),
                                    name: z.string(),
                                    role: z.string(),
                                    bio: z.string().nullable(),
                                    imageUrl: z.string().nullable(),
                                    createdAt: z.string(),
                                    hierarchy: z.number().nullable()
                                })
                            )
                        })
                    }
                }
            },
            '400': {
                description: 'Failed to retrieve professionals',
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
    async handle(): Promise<object> {
        const findAllProfessionalUseCase = new FindAllProfessionalUseCase(professionalRepository);
        const professionals = await findAllProfessionalUseCase.execute();

        return {
            success: true,
            result: professionals.map((professional) => ({
                id: professional.id,
                name: professional.name,
                role: professional.role,
                bio: professional.bio,
                imageUrl: professional.imageUrl,
                createdAt: professional.createdAt.toISOString(),
                hierarchy: professional.hierarchy
            }))
        };
    }
}
