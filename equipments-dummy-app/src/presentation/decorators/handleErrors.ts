import { z } from 'zod';

export interface ErrorResponse {
    success: boolean;
    message: string;
    statusCode?: number;
}

/**
 * Error handling annotation for controller methods
 */
export function withErrorHandling(
    targetOrFn: object,
    propertyKey?: string,
    descriptor?: PropertyDescriptor
): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]): Promise<object> {
        try {
            return await originalMethod.apply(this, args);
        } catch (error) {
            console.error(`Error in ${targetOrFn.constructor.name}.${propertyKey}:`, error);

            if (error instanceof z.ZodError) {
                return {
                    success: false,
                    message: 'Validation failed',
                    errors: error.errors
                };
            }

            return {
                success: false,
                message: error.message || 'An unexpected error occurred',
                statusCode: error.statusCode || 500
            };
        }
    };

    return descriptor;
}
