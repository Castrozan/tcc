import { body, param, validationResult } from 'express-validator';
import { UserValidationException } from '../exceptions/user.exceptions.js';
import { Request } from 'express';

export class UserValidators {
    static async verifyCreateUser(req: Request): Promise<void> {
        await body('name').exists().isString().isLength({ min: 1 }).run(req);

        await body('email').exists().isEmail().run(req);

        await body('password').exists().isString().isLength({ min: 1 }).run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new UserValidationException('Invalid user data', errors.array());
        }
    }

    static async verifyUpdateUser(req: Request): Promise<void> {
        await body('name').exists().isString().isLength({ min: 1 }).run(req);

        await body('email').exists().isEmail().run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new UserValidationException('Invalid user data', errors.array());
        }
    }

    static async verifyDeleteUser(req: Request): Promise<void> {
        await param('id').exists().isInt().run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new UserValidationException('Invalid user data', errors.array());
        }
    }

    static async verifyGetUser(req: Request): Promise<void> {
        await param('id').exists().isInt().run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new UserValidationException('Invalid user data', errors.array());
        }
    }
}
