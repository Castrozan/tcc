import { UpdateEquipmentUseCase } from 'application/use-cases/equipments/UpdateEquipmentUseCase';
import { Bool, OpenAPIRoute } from 'chanfana';
import equipmentRepository from 'infrastructure/database/repositories/equipments';
import { withErrorHandling } from 'presentation/decorators';
import { z } from 'zod';

export class UpdateEquipmentController extends OpenAPIRoute {
    schema = {
        tags: ['Equipments'],
        summary: 'Update an existing equipment',
        security: [{ bearerAuth: [] }],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: z.object({
                            id: z.number().min(1, { message: 'ID is required' }),
                            name: z.string().min(1, { message: 'Name is required' }),
                            description: z.string().optional(),
                            imageUrl: z.string().url({ message: 'Invalid URL' }).optional(),
                            type: z.string().optional()
                        })
                    }
                }
            }
        },
        responses: {
            '200': {
                description: 'Equipment updated successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            success: Bool(),
                            result: z.object({
                                id: z.number(),
                                name: z.string(),
                                description: z.string().nullable(),
                                imageUrl: z.string().nullable(),
                                createdAt: z.string(),
                                updatedAt: z.string(),
                                type: z.string().nullable()
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
            '404': {
                description: 'Equipment not found',
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

        const { id, name, description, imageUrl, type } = data.body;

        const updateEquipmentUseCase = new UpdateEquipmentUseCase(equipmentRepository);

        const equipment = await updateEquipmentUseCase.execute({
            id,
            name,
            description,
            imageUrl,
            type
        });

        return {
            success: true,
            result: {
                id: equipment.id,
                name: equipment.name,
                description: equipment.description,
                imageUrl: equipment.imageUrl,
                createdAt: equipment.createdAt.toISOString(),
                type: equipment.type
            }
        };
    }
}
