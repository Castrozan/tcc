import { Request, Response } from 'express';
import { UserValidators } from '../validators/user.validators.js';
import { UserService } from '../services/user.service.js';
import { withErrorHandling } from '../exceptions/error-handler.js';

export class UserController {
    constructor(private readonly userService: UserService) {}

    @withErrorHandling
    async createUser(req: Request, res: Response): Promise<void> {
        await UserValidators.verifyCreateUser(req);
        const user = await this.userService.createUser(req.body);
        res.status(201).json({ success: true, user });
    }

    @withErrorHandling
    async getUser(req: Request, res: Response): Promise<void> {
        await UserValidators.verifyGetUser(req);
        const id = Number(req.params.id);
        const user = await this.userService.getUserById(id);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.status(200).json({ success: true, user });
    }

    @withErrorHandling
    async updateUser(req: Request, res: Response): Promise<void> {
        await UserValidators.verifyUpdateUser(req);
        const id = Number(req.params.id);
        const user = await this.userService.updateUser(id, req.body);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.status(200).json({ success: true, user });
    }

    @withErrorHandling
    async deleteUser(req: Request, res: Response): Promise<void> {
        await UserValidators.verifyDeleteUser(req);
        const id = Number(req.params.id);
        const deleted = await this.userService.deleteUser(id);
        if (!deleted) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.status(204).send();
    }

    @withErrorHandling
    async listUsers(_req: Request, res: Response): Promise<void> {
        const users = await this.userService.getAllUsers();
        res.status(200).json({ success: true, users });
    }
}
