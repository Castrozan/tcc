import { DeleteArticleUseCase } from 'application/use-cases/articles/DeleteArticleUseCase';
import { OpenAPIRoute } from 'chanfana';
import articleRepository from 'infrastructure/database/repositories/articles';
import { withErrorHandling } from 'presentation/decorators';
import { errorResponses, simpleSuccessResponse } from 'presentation/schemas/responses';
import { z } from 'zod';

export class DeleteArticleController extends OpenAPIRoute {
    schema = {
        tags: ['Articles'],
        summary: 'Delete an existing article',
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.number().min(1, { message: 'ID is required' })
            })
        },
        responses: {
            '200': {
                description: 'Article deleted successfully',
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

        const deleteArticleUseCase = new DeleteArticleUseCase(articleRepository);

        await deleteArticleUseCase.execute(id);

        return {
            success: true
        };
    }
}
