import { FindByIdProfessionalUseCase } from 'application/use-cases/professionals/FindByIdProfessionalUseCase';
import { Bool, OpenAPIRoute } from 'chanfana';
import professionalRepository from 'infrastructure/database/repositories/professionals';
import { withErrorHandling } from 'presentation/decorators';
import { z } from 'zod';

export class FindByIdProfessionalController extends OpenAPIRoute {
    schema = {
        tags: ['Professionals'],
        summary: 'Retrieve a professional by ID',
        parameters: [
            {
                name: 'id',
                in: 'path' as const,
                required: true,
                schema: {
                    type: 'integer' as const
                },
                description: 'ID of the professional to retrieve'
            }
        ],
        responses: {
            '200': {
                description: 'Professional retrieved successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            success: Bool(),
                            result: z
                                .object({
                                    id: z.number(),
                                    name: z.string(),
                                    role: z.string(),
                                    bio: z.string().nullable(),
                                    imageUrl: z.string().nullable(),
                                    createdAt: z.string(),
                                    hierarchy: z.number().nullable()
                                })
                                .nullable()
                        })
                    }
                }
            },
            '400': {
                description: 'Failed to retrieve professional',
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
        const findByIdProfessionalUseCase = new FindByIdProfessionalUseCase(professionalRepository);
        const professional = await findByIdProfessionalUseCase.execute(id);

        if (!professional) {
            return {
                success: false,
                message: 'Professional not found'
            };
        }

        return {
            success: true,
            result: {
                id: professional.id,
                name: professional.name,
                role: professional.role,
                bio: professional.bio,
                imageUrl: professional.imageUrl,
                createdAt: professional.createdAt.toISOString(),
                hierarchy: professional.hierarchy
            }
        };
    }
}
