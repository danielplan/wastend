import request from 'supertest';
import app from '../src/app';
import User from '../src/models/user.model';

const apiBase = '';


describe('USER API', () => {
    describe('/user/register', () => {

        it('should register correct user correctly', async () => {
            const response = await request(app).post(`${apiBase}/user/register`).send({
                name: 'Test user',
                email: 'test@email.com',
                password: 'password123',
            });
            const databaseEntry = await User.getByEmail('test@email.com');
            expect(response.status).toBe(200);
            expect(databaseEntry).toBeTruthy();
            expect(databaseEntry.password).toBeUndefined();
            expect(databaseEntry.passwordHash).not.toBe('password123');
        });

        it('should should fail for incorrect data', async () => {
            let response = await request(app).post(`${apiBase}/user/register`).send({
                name: '',
                email: 'test',
                password: '',
            });
            expect(response.status).toBe(500);
            response = await request(app).post(`${apiBase}/user/register`).send({
                name: 'asdfasdf',
                email: 'test@user.de',
                password: 'asdf',
            });
            expect(response.status).toBe(500);
            response = await request(app).post(`${apiBase}/user/register`).send({
                name: 'as',
                email: 'test@user.de',
                password: 'asdfasdf',
            });
            expect(response.status).toBe(500);
            response = await request(app).post(`${apiBase}/user/register`).send({
                name: 'asasdfasdf',
                email: 'test@us',
                password: 'asdfasdf',
            });
            expect(response.status).toBe(500);
        });

        it('should fail for same email twice', async () => {
            let response = await request(app).post(`${apiBase}/user/register`).send({
                name: 'Test user',
                email: 'test@email2.com',
                password: 'password123',
            });

            expect(response.status).toBe(200);
            response = await request(app).post(`${apiBase}/user/register`).send({
                name: 'Test user',
                email: 'test@email2.com',
                password: 'password123',
            });

            expect(response.status).toBe(500);
        });
        it('should give token pair', async () => {
            let response = await request(app).post(`${apiBase}/user/register`).send({
                name: 'Test user',
                email: 'test@email3.com',
                password: 'password123',
            });
            expect(response.status).toBe(200);
            expect(response.body).toBeTruthy();
            expect(response.body.accessToken.length).toBeGreaterThan(0);
            expect(response.body.refreshToken.length).toBeGreaterThan(0);
        });
    });
    describe('/user/login', () => {
        it('should login correct user correctly', async () => {
            await request(app).post(`${apiBase}/user/register`).send({
                name: 'Test user',
                email: 'test@email.com',
                password: 'password123',
            });
            const response = await request(app).post(`${apiBase}/user/login`).send({
                email: 'test@email.com',
                password: 'password123',
            });
            expect(response.status).toBe(200);
            expect(response.body).toBeTruthy();
            expect(response.body.accessToken.length).toBeGreaterThan(0);
            expect(response.body.refreshToken.length).toBeGreaterThan(0);
        });

        it('should fail for incorrect user data', async () => {
            let response = await request(app).post(`${apiBase}/user/login`).send({
                email: 'test@email.com',
                password: 'password1234',
            });
            expect(response.status).toBe(500);
            response = await request(app).post(`${apiBase}/user/login`).send({
                email: 'testx@email.com',
                password: 'password123',
            });
            expect(response.status).toBe(500);
        });
    });
});
