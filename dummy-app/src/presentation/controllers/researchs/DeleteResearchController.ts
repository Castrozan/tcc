import { DeleteResearchUseCase } from 'application/use-cases/researchs/DeleteResearchUseCase';
import { OpenAPIRoute } from 'chanfana';
import researchRepository from 'infrastructure/database/repositories/researchs';
import { withErrorHandling } from 'presentation/decorators';
import { errorResponses, simpleSuccessResponse } from 'presentation/schemas/responses';
import { z } from 'zod';

export class DeleteResearchController extends OpenAPIRoute {
    schema = {
        tags: ['Researchs'],
        summary: 'Delete an existing research',
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.number().min(1, { message: 'ID is required' })
            })
        },
        responses: {
            '200': {
                description: 'Research deleted successfully',
                content: {
                    'application/json': {
                        schema: z.object(simpleSuccessResponse)
                    }
                }
            },
            ...errorResponses
        }
    };

    @withErrorHandling
    async handle(): Promise<object> {
        const data = await this.getValidatedData<typeof this.schema>();

        const { id } = data.params;

        const deleteResearchUseCase = new DeleteResearchUseCase(researchRepository);

        await deleteResearchUseCase.execute(id);

        return {
            success: true
        };
    }
}
