import request from 'supertest';
import app from '../server.js';

describe('Test app.ts', () => {
    test('Alive route', async () => {
        const res = await request(app).get('/api/alive');
        expect(res.text).toEqual('yes');
    });
});
