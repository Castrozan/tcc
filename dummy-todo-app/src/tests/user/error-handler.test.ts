import {
    ValidationErrorHandler,
    DefaultErrorHandler,
    ErrorHandlerChain,
    createErrorHandlingMiddleware,
    withErrorHandling,
    IErrorHandler
} from '../../user/exceptions/error-handler.js';
import { UserValidationException } from '../../user/exceptions/user.exceptions.js';
import { Request, Response } from 'express';

describe('ValidationErrorHandler', () => {
    let validationHandler: ValidationErrorHandler;
    let mockRes: Partial<Response>;
    let mockJsonFn: jest.Mock;
    let mockStatusFn: jest.Mock;

    beforeEach(() => {
        validationHandler = new ValidationErrorHandler();
        mockJsonFn = jest.fn();
        mockStatusFn = jest.fn().mockReturnValue({ json: mockJsonFn });
        mockRes = {
            status: mockStatusFn,
            json: mockJsonFn
        };
    });

    test('canHandle should return true for UserValidationException', () => {
        const error = new UserValidationException('Validation failed', { field: 'error' });
        expect(validationHandler.canHandle(error)).toBe(true);
    });

    test('canHandle should return false for other errors', () => {
        const error = new Error('Generic error');
        expect(validationHandler.canHandle(error)).toBe(false);
    });

    test('handle should set correct status code and response for validation error', () => {
        const error = new UserValidationException('Validation failed', { field: 'error' });
        validationHandler.handle(error, mockRes as Response);

        expect(mockStatusFn).toHaveBeenCalledWith(422);
        expect(mockJsonFn).toHaveBeenCalledWith({
            success: false,
            message: 'Validation failed',
            errors: { field: 'error' }
        });
    });
});

describe('DefaultErrorHandler', () => {
    let defaultHandler: DefaultErrorHandler;
    let mockRes: Partial<Response>;
    let mockJsonFn: jest.Mock;
    let mockStatusFn: jest.Mock;
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        defaultHandler = new DefaultErrorHandler();
        mockJsonFn = jest.fn();
        mockStatusFn = jest.fn().mockReturnValue({ json: mockJsonFn });
        mockRes = {
            status: mockStatusFn,
            json: mockJsonFn
        };
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    test('canHandle should always return true', () => {
        const error = new Error('Generic error');
        expect(defaultHandler.canHandle(error)).toBe(true);
    });

    test('handle should set 500 status code and internal server error message', () => {
        const error = new Error('Generic error');
        defaultHandler.handle(error, mockRes as Response);

        expect(consoleErrorSpy).toHaveBeenCalled();
        expect(mockStatusFn).toHaveBeenCalledWith(500);
        expect(mockJsonFn).toHaveBeenCalledWith({
            success: false,
            message: 'Internal server error'
        });
    });
});

describe('ErrorHandlerChain', () => {
    let errorChain: ErrorHandlerChain;
    let mockRes: Partial<Response>;
    let mockJsonFn: jest.Mock;
    let mockStatusFn: jest.Mock;

    beforeEach(() => {
        mockJsonFn = jest.fn();
        mockStatusFn = jest.fn().mockReturnValue({ json: mockJsonFn });
        mockRes = {
            status: mockStatusFn,
            json: mockJsonFn
        };
    });

    test('should handle ValidationException with the appropriate handler', () => {
        errorChain = new ErrorHandlerChain();
        const error = new UserValidationException('Validation error', { field: 'error' });
        errorChain.handleError(error, mockRes as Response);

        expect(mockStatusFn).toHaveBeenCalledWith(422);
        expect(mockJsonFn).toHaveBeenCalledWith({
            success: false,
            message: 'Validation error',
            errors: { field: 'error' }
        });
    });

    test('should handle generic Error with the default handler', () => {
        errorChain = new ErrorHandlerChain();
        const error = new Error('Generic error');
        errorChain.handleError(error, mockRes as Response);

        expect(mockStatusFn).toHaveBeenCalledWith(500);
        expect(mockJsonFn).toHaveBeenCalledWith({
            success: false,
            message: 'Internal server error'
        });
    });

    test('should allow registering custom handlers', () => {
        // Create a custom error handler chain manually without using the constructor
        errorChain = new ErrorHandlerChain();

        // Create a custom handler
        const mockHandler: IErrorHandler = {
            canHandle: jest.fn().mockImplementation((err) => err.message === 'Custom error'),
            handle: jest.fn().mockImplementation((_err, res) => {
                res.status(400).json({ success: false, message: 'Custom error handled' });
            })
        };

        // First clear the chain's default handlers that were added in the constructor
        (errorChain as any).handlers = [];

        // Register our custom handler first, then the standard ones
        errorChain.registerHandler(mockHandler);
        errorChain.registerHandler(new ValidationErrorHandler());
        errorChain.registerHandler(new DefaultErrorHandler());

        // Test with the custom error
        const customError = new Error('Custom error');
        errorChain.handleError(customError, mockRes as Response);

        expect(mockHandler.canHandle).toHaveBeenCalled();
        expect(mockHandler.handle).toHaveBeenCalled();
        expect(mockStatusFn).toHaveBeenCalledWith(400);
        expect(mockJsonFn).toHaveBeenCalledWith({
            success: false,
            message: 'Custom error handled'
        });
    });
});

describe('Middleware', () => {
    test('createErrorHandlingMiddleware should return a function', () => {
        const middleware = createErrorHandlingMiddleware();
        expect(typeof middleware).toBe('function');
    });

    test('middleware should handle errors properly', () => {
        const middleware = createErrorHandlingMiddleware();
        const mockReq = {} as Request;
        const mockJsonFn = jest.fn();
        const mockStatusFn = jest.fn().mockReturnValue({ json: mockJsonFn });
        const mockRes = {
            status: mockStatusFn,
            json: mockJsonFn
        } as unknown as Response;
        const mockNext = jest.fn();
        const error = new Error('Test error');

        middleware(error, mockReq, mockRes, mockNext);

        expect(mockStatusFn).toHaveBeenCalledWith(500);
        expect(mockJsonFn).toHaveBeenCalledWith({
            success: false,
            message: 'Internal server error'
        });
    });
});

describe('withErrorHandling decorator', () => {
    test('should wrap a method with error handling', async () => {
        const mockReq = {} as Request;
        const mockJsonFn = jest.fn();
        const mockStatusFn = jest.fn().mockReturnValue({ json: mockJsonFn });
        const mockSendFn = jest.fn();
        const mockRes = {
            status: mockStatusFn,
            json: mockJsonFn,
            send: mockSendFn
        } as unknown as Response;

        // Mock class with decorated method
        class TestController {
            @withErrorHandling
            async successMethod(req: Request, res: Response) {
                res.status(200).json({ success: true });
            }

            @withErrorHandling
            async errorMethod(_req: Request, _res: Response) {
                throw new Error('Test error');
            }

            @withErrorHandling
            async validationErrorMethod(_req: Request, _res: Response) {
                throw new UserValidationException('Validation failed', { field: 'error' });
            }
        }

        const controller = new TestController();

        // Test successful execution
        await controller.successMethod(mockReq, mockRes);
        expect(mockStatusFn).toHaveBeenCalledWith(200);
        expect(mockJsonFn).toHaveBeenCalledWith({ success: true });

        // Reset mocks
        mockStatusFn.mockClear();
        mockJsonFn.mockClear();

        // Test with generic error
        await controller.errorMethod(mockReq, mockRes);
        expect(mockStatusFn).toHaveBeenCalledWith(500);
        expect(mockJsonFn).toHaveBeenCalledWith({
            success: false,
            message: 'Internal server error'
        });

        // Reset mocks
        mockStatusFn.mockClear();
        mockJsonFn.mockClear();

        // Test with validation error
        await controller.validationErrorMethod(mockReq, mockRes);
        expect(mockStatusFn).toHaveBeenCalledWith(422);
        expect(mockJsonFn).toHaveBeenCalledWith({
            success: false,
            message: 'Validation failed',
            errors: { field: 'error' }
        });
    });
});
