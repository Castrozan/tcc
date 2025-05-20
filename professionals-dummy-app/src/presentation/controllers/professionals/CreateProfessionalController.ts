import { CreateProfessionalUseCase } from 'application/use-cases/professionals/CreateProfessionalUseCase';
import { Bool, OpenAPIRoute } from 'chanfana';
import professionalRepository from 'infrastructure/database/repositories/professionals';
import { withErrorHandling } from 'presentation/decorators';
import { z } from 'zod';

export class CreateProfessionalController extends OpenAPIRoute {
    schema = {
        tags: ['Professionals'],
        summary: 'Create a new Professional',
        security: [{ bearerAuth: [] }],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: z.object({
                            name: z.string().min(1, { message: 'Name is required' }),
                            role: z.string().min(1, { message: 'Role is required' }),
                            bio: z.string().optional(),
                            imageUrl: z.string().url({ message: 'Invalid URL' }).optional(),
                            hierarchy: z.number().nullable()
                        })
                    }
                }
            }
        },
        responses: {
            '201': {
                description: 'Professional created successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            success: Bool(),
                            result: z.object({
                                id: z.number(),
                                name: z.string(),
                                role: z.string(),
                                bio: z.string().nullable(),
                                imageUrl: z.string().nullable(),
                                createdAt: z.string(),
                                hierarchy: z.number().nullable()
                            })
                        })
                    }
                }
            },
            '400': {
                description: 'Invalid input',
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
        const data = await this.getValidatedData<typeof this.schema>();

        const { name, role, bio, imageUrl, hierarchy } = data.body;

        const createProfessionalUseCase = new CreateProfessionalUseCase(professionalRepository);

        const professional = await createProfessionalUseCase.execute({
            name,
            role,
            bio,
            imageUrl,
            hierarchy
        });

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
