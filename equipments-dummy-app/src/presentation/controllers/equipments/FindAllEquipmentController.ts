import { FindAllEquipmentsUseCase } from 'application/use-cases/equipments/FindAllEquipmentUseCase';
import { Bool, OpenAPIRoute } from 'chanfana';
import equipmentRepository from 'infrastructure/database/repositories/equipments';
import { withErrorHandling } from 'presentation/decorators';
import { z } from 'zod';

export class FindAllEquipmentController extends OpenAPIRoute {
    schema = {
        tags: ['Equipments'],
        summary: 'Retrieve all equipments',
        responses: {
            '200': {
                description: 'List of equipments retrieved successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            success: Bool(),
                            result: z.array(
                                z.object({
                                    id: z.number(),
                                    name: z.string(),
                                    description: z.string().nullable(),
                                    imageUrl: z.string().nullable(),
                                    createdAt: z.string(),
                                    type: z.string().nullable()
                                })
                            )
                        })
                    }
                }
            },
            '400': {
                description: 'Failed to retrieve equipments',
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
        const findAllEquipmentsUseCase = new FindAllEquipmentsUseCase(equipmentRepository);
        const equipments = await findAllEquipmentsUseCase.execute();

        return {
            success: true,
            result: equipments.map((equipment) => ({
                id: equipment.id,
                name: equipment.name,
                description: equipment.description,
                imageUrl: equipment.imageUrl,
                createdAt: equipment.createdAt.toISOString(),
                type: equipment.type
            }))
        };
    }
}
