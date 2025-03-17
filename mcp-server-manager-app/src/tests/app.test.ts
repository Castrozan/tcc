import request from 'supertest';
import app from '../app.js';

describe('Test app.ts', () => {
    test('Alive route', async () => {
        const res = await request(app).get('/alive');
        expect(res.text).toEqual('yes');
    });
});
