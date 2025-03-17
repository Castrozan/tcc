export class InvalidTokenException extends Error {
    public statusCode: number;
    public errors?: any;

    constructor(message: string, errors?: any) {
        super(message);
        this.statusCode = 401;
        this.errors = errors;
    }
}

export class GatewayValidationException extends Error {
    public statusCode: number;
    public errors?: any;

    constructor(message: string, errors?: any) {
        super(message);
        this.statusCode = 401;
        this.errors = errors;
    }
}
