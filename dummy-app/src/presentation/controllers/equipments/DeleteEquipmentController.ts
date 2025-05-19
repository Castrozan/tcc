import { DeleteEquipmentUseCase } from 'application/use-cases/equipments/DeleteEquipmentUseCase';
import { Bool, OpenAPIRoute } from 'chanfana';
import equipmentRepository from 'infrastructure/database/repositories/equipments';
import { withErrorHandling } from 'presentation/decorators';
import { z } from 'zod';

export class DeleteEquipmentController extends OpenAPIRoute {
    schema = {
        tags: ['Equipments'],
        summary: 'Delete an existing equipment',
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.number().min(1, { message: 'ID is required' })
            })
        },
        responses: {
            '200': {
                description: 'Equipment deleted successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            success: Bool()
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

        const { id } = data.params;

        const deleteEquipmentUseCase = new DeleteEquipmentUseCase(equipmentRepository);

        await deleteEquipmentUseCase.execute(id);

        return {
            success: true
        };
    }
}
