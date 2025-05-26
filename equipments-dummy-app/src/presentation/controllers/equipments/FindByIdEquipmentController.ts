import { FindByIdEquipmentUseCase } from 'application/use-cases/equipments/FindByIdEquipmentUseCase';
import { Bool, OpenAPIRoute } from 'chanfana';
import equipmentRepository from 'infrastructure/database/repositories/equipments';
import { withErrorHandling } from 'presentation/decorators';
import { z } from 'zod';

export class FindByIdEquipmentController extends OpenAPIRoute {
    schema = {
        tags: ['Equipments'],
        summary: 'Retrieve an equipment by ID',
        request: {
            params: z.object({
                id: z.number().min(1, { message: 'ID is required' })
            })
        },
        responses: {
            '200': {
                description: 'Equipment retrieved successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            success: Bool(),
                            result: z
                                .object({
                                    id: z.number(),
                                    name: z.string(),
                                    description: z.string().nullable(),
                                    imageUrl: z.string().nullable(),
                                    createdAt: z.string(),
                                    type: z.string().nullable()
                                })
                                .nullable()
                        })
                    }
                }
            },
            '400': {
                description: 'Failed to retrieve equipment',
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
        const { id } = data.params;

        const findByIdEquipmentUseCase = new FindByIdEquipmentUseCase(equipmentRepository);
        const equipment = await findByIdEquipmentUseCase.execute(id);

        if (!equipment) {
            return {
                success: false,
                message: 'Equipment not found'
            };
        }

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
