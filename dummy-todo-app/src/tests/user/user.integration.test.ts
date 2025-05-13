import request from 'supertest';
import app from '../../app.js';

describe('UserController', () => {
    let createdUserId: number;

    it('POST /api/users creates a new user', async () => {
        const res = await request(app).post('/api/users').send({
            name: 'Test User',
            email: 'test@example.com',
            password: 'testpassword'
        });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.user).toHaveProperty('id');
        expect(res.body.user.name).toBe('Test User');
        expect(res.body.user.email).toBe('test@example.com');

        createdUserId = res.body.user.id;
    });

    it('GET /api/users returns list of users', async () => {
        const res = await request(app).get('/api/users');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.users)).toBe(true);
        expect(res.body.users.length).toBeGreaterThan(0);
    });

    it('GET /api/users/:id returns a single user', async () => {
        const res = await request(app).get(`/api/users/${createdUserId}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.user).toHaveProperty('id', createdUserId);
        expect(res.body.user.name).toBe('Test User');
        expect(res.body.user.email).toBe('test@example.com');
    });

    it('PUT /api/users/:id updates an existing user', async () => {
        const res = await request(app).put(`/api/users/${createdUserId}`).send({
            name: 'Updated User',
            email: 'updated@example.com'
        });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.user.name).toBe('Updated User');
        expect(res.body.user.email).toBe('updated@example.com');
    });

    it('GET /api/users/:id returns 404 for non-existent user', async () => {
        const res = await request(app).get('/api/users/9999');

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    });

    it('DELETE /api/users/:id deletes a user', async () => {
        const res = await request(app).delete(`/api/users/${createdUserId}`);

        expect(res.status).toBe(204);

        const getRes = await request(app).get(`/api/users/${createdUserId}`);
        expect(getRes.status).toBe(404);
    });
});
