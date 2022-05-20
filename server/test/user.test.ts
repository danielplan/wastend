import request from 'supertest';
import app from '../src/app';

const apiBase = '';

import { migrate, close } from '../src/database';





describe('USER API', () => {
    it('should register correct', async () => {
        const response = await request(app).post(`${apiBase}/user/register`).send({
            name: 'Test user',
            email: 'test@email.com',
            password: 'password123',
        });
        expect(response.status).toBe(200);
    });

    it('should should fail for incorrect data', async () => {
        const response = await request(app).post(`${apiBase}/user/register`).send({
            name: '',
            email: 'test',
            password: '',
        });
        expect(response.status).toBe(500);
    });

    it('should should fail for double email', async () => {
        const response = await request(app).post(`${apiBase}/user/register`).send({
            name: 'Test user',
            email: 'test@email.com',
            password: 'password123',
        });

        expect(response.status).toBe(500);
    });
});
