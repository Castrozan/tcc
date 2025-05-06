import { Request, Response } from 'express';
import { User } from '../models/user.model.js';

// In-memory mock data
let users: User[] = [
    { id: 1, name: 'Alice', email: 'alice@example.com', password_hash: 'hash1' },
    { id: 2, name: 'Bob', email: 'bob@example.com', password_hash: 'hash2' }
];
let nextId = 3;

export class UserController {
    async createUser(req: Request, res: Response): Promise<void> {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ success: false, message: 'Missing required fields' });
            return;
        }
        const newUser: User = {
            id: nextId++,
            name,
            email,
            password_hash: `mockhash_${password}`
        };
        users.push(newUser);
        res.status(201).json({ success: true, user: newUser });
    }

    async getUser(req: Request, res: Response): Promise<void> {
        const id = Number(req.params.id);
        const user = users.find((u) => u.id === id);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.status(200).json({ success: true, user });
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        const id = Number(req.params.id);
        const user = users.find((u) => u.id === id);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        const { name, email, password } = req.body;
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password_hash = `mockhash_${password}`;
        res.status(200).json({ success: true, user });
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        const id = Number(req.params.id);
        const index = users.findIndex((u) => u.id === id);
        if (index === -1) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        users.splice(index, 1);
        res.status(204).send();
    }

    async listUsers(_req: Request, res: Response): Promise<void> {
        res.status(200).json({ success: true, users });
    }
}
