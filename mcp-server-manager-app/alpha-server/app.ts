import express, { Application, Request, Response } from 'express';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', (req: Request, res: Response): void => {
    if (!req.query.database || !req.query.system || !req.query.entity) {
        res.status(401).json({
            message: 'Unauthorized'
        });
        return;
    }

    res.status(200).json({
        uriRedirect: 'http://localhost:3001',
        method: 'PUT',
        headers: {
            Authorization: 'Bearer access-token-to-mock-application',
            Accept: 'application/json'
        }
    });
});

app.all('*', (req: Request, res: Response): void => {
    if (req.headers.authorization !== 'Bearer access-token-to-mock-application') {
        res.status(401).json({
            message: 'Unauthorized'
        });
        return;
    }

    res.status(200).json({
        message: 'Bem vindo a aplicacao de mock',
        receivedPath: req.path,
        receivedMethod: req.method,
        receivedQuery: req.query,
        receivedBody: req.body,
        receivedHeaders: req.headers
    });
});

export default app;
