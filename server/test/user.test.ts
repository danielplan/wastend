import request from 'supertest';
import app from '../src/app';
import User from '../src/models/user.model';

const apiBase = '';


describe('USER API', () => {
    describe('POST /user', () => {

        it('should register correct user correctly', async () => {
            const response = await request(app).post(`${apiBase}/user`).send({
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
            let response = await request(app).post(`${apiBase}/user`).send({
                name: '',
                email: 'test',
                password: '',
            });
            expect(response.status).toBe(500);
            response = await request(app).post(`${apiBase}/user`).send({
                name: 'asdfasdf',
                email: 'test@user.de',
                password: 'asdf',
            });
            expect(response.status).toBe(500);
            response = await request(app).post(`${apiBase}/user`).send({
                name: 'as',
                email: 'test@user.de',
                password: 'asdfasdf',
            });
            expect(response.status).toBe(500);
            response = await request(app).post(`${apiBase}/user`).send({
                name: 'asasdfasdf',
                email: 'test@us',
                password: 'asdfasdf',
            });
            expect(response.status).toBe(500);
        });

        it('should fail for same email twice', async () => {
            let response = await request(app).post(`${apiBase}/user`).send({
                name: 'Test user',
                email: 'test@email2.com',
                password: 'password123',
            });

            expect(response.status).toBe(200);
            response = await request(app).post(`${apiBase}/user`).send({
                name: 'Test user',
                email: 'test@email2.com',
                password: 'password123',
            });

            expect(response.status).toBe(500);
        });
        it('should give token pair', async () => {
            let response = await request(app).post(`${apiBase}/user`).send({
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
    describe('POST /user/login', () => {
        it('should login correct user correctly', async () => {
            await request(app).post(`${apiBase}/user`).send({
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
    describe('PUT /user', () => {
        it('should update correctly', async () => {
            await request(app).post(`${apiBase}/user`).send({
                name: 'Test user',
                email: 'test@email.com',
                password: 'password123',
            });
            const {body: tokens} = await request(app).post(`${apiBase}/user/login`).send({
                email: 'test@email.com',
                password: 'password123',
            });
            const databaseEntry = await User.getByEmail('test@email.com');
            const { accessToken, refreshToken } = tokens;
            const response = await request(app).put(`${apiBase}/user`)
                .set('access-token', accessToken)
                .set('refresh-token', refreshToken).send({
                    email: 'test5@email.com',
                    password: 'password1235',
                    name: 'asdfuser',
                });
            expect(response.status).toBe(200);
            expect(response.body).toBeTruthy();
            const user = await User.get(databaseEntry.id) as User;
            expect(user.name).toBe('asdfuser');
            expect(user.email).toBe('test5@email.com');

        });

        it('should update only parts correctly', async () => {
            await request(app).post(`${apiBase}/user`).send({
                name: 'Test user',
                email: 'test@emaildsafasdf.com',
                password: 'password123',
            });

            const databaseEntry = await User.getByEmail('test@emaildsafasdf.com');

            const { body: tokens } = await request(app).post(`${apiBase}/user/login`).send({
                email: 'test@emaildsafasdf.com',
                password: 'password123',
            });
            const { accessToken, refreshToken } = tokens;
            const response = await request(app).put(`${apiBase}/user`)
                .set('access-token', accessToken)
                .set('refresh-token', refreshToken)
                .send({
                    name: 'asdfuser',
                });
            expect(response.status).toBe(200);
            expect(response.body).toBeTruthy();
            const user = await User.get(databaseEntry.id) as User;
            expect(user.name).toBe('asdfuser');
            expect(user.email).toBe('test@emaildsafasdf.com');

        });

        it('should fail for incorrect user data', async () => {
            const { body: loginData } = await request(app).post(`${apiBase}/user`).send({
                name: 'Test user',
                email: 'test234234234@email.com',
                password: 'password123',
            });
            const { accessToken, refreshToken } = loginData;
            let response = await request(app).put(`${apiBase}/user`)
                .set('access-token', accessToken)
                .set('refresh-token', refreshToken)
                .send({
                    email: 'test.com',
                    password: 'passwor',
                });
            expect(response.status).toBe(500);
        });
    });
});
