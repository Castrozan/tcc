import request from 'supertest';
import app from '../server.js';

describe('ExampleController', () => {
    it('GET /api/example/hello returns greeting', async () => {
        const res = await request(app).get('/api/example/hello');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ success: true, message: 'Hello from ExampleController!' });
    });
});
