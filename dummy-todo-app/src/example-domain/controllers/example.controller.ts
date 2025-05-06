import { Request, Response } from 'express';

export class ExampleController {
    async hello(_req: Request, res: Response): Promise<void> {
        res.status(200).json({ success: true, message: 'Hello from ExampleController!' });
    }
}
