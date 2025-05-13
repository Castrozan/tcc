import { Request, Response, NextFunction } from 'express';
import { UserValidationException } from './user.exceptions.js';

/**
 * Interface for error handlers following the Single Responsibility Principle
 */
export interface IErrorHandler {
    canHandle(error: Error): boolean;
    handle(error: Error, res: Response): void;
}

/**
 * Handler for UserValidationException
 */
export class ValidationErrorHandler implements IErrorHandler {
    canHandle(error: Error): boolean {
        return error instanceof UserValidationException;
    }

    handle(error: Error, res: Response): void {
        const validationError = error as UserValidationException;
        res.status(validationError.statusCode).json({
            success: false,
            message: validationError.message,
            errors: validationError.errors
        });
    }
}

/**
 * Default error handler for unhandled error types
 */
export class DefaultErrorHandler implements IErrorHandler {
    canHandle(_error: Error): boolean {
        return true; // Handles any error
    }

    handle(error: Error, res: Response): void {
        console.error('Unexpected error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

/**
 * Error handler chain using the Chain of Responsibility pattern
 */
export class ErrorHandlerChain {
    private handlers: IErrorHandler[] = [];

    constructor() {
        // Register handlers in order of specificity
        this.registerHandler(new ValidationErrorHandler());
        this.registerHandler(new DefaultErrorHandler());
    }

    registerHandler(handler: IErrorHandler): void {
        this.handlers.push(handler);
    }

    handleError(error: Error, res: Response): void {
        // Find the first handler that can handle this error
        for (const handler of this.handlers) {
            if (handler.canHandle(error)) {
                handler.handle(error, res);
                return;
            }
        }
    }
}

/**
 * Middleware for Express that uses the error handler chain
 */
export function createErrorHandlingMiddleware() {
    const errorChain = new ErrorHandlerChain();

    return (err: Error, _req: Request, res: Response, _next: NextFunction) => {
        errorChain.handleError(err, res);
    };
}

/**
 * Controller method decorator for error handling
 */
export function withErrorHandling(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    const originalMethod = descriptor.value;
    const errorChain = new ErrorHandlerChain();

    descriptor.value = async function (req: Request, res: Response) {
        try {
            await originalMethod.call(this, req, res);
        } catch (error) {
            errorChain.handleError(error as Error, res);
        }
    };

    return descriptor;
}
