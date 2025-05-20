import { Bool } from 'chanfana';
import { z } from 'zod';

export const errorResponses = {
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
        description: 'Resource not found',
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
};

// Define the success response as a ZodRawShape for direct use in z.object()
export const successResponse = (resultSchema: z.ZodTypeAny): z.ZodRawShape => ({
    success: Bool(),
    result: resultSchema
});

// Simple success response without a result object
export const simpleSuccessResponse = {
    success: Bool()
};
