export class UserValidationException extends Error {
    public statusCode: number;
    public errors?: any;

    constructor(message: string, errors?: any) {
        super(message);
        this.statusCode = 422;
        this.errors = errors;
    }
}
