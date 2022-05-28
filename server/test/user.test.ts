import request from 'supertest';
import app from '../src/app';
import User from '../src/models/user.model';
import { nanoid } from 'nanoid';
import { apiBase } from './setupTest';
import { Tokens } from '../src/services/auth.service';

interface UserData extends Tokens {
    userId: string;
}

export async function createTokens(): Promise<UserData> {
    const name = nanoid(10);
    const email = nanoid(10) + '@email.com';
    const password = nanoid(10);

    //register
    const { body: tokens } = await request(app).post(`${apiBase}/user`).send({
        name,
        email,
        password,
    });
    const user = await User.getByEmail(email);
    return {...tokens, userId: user.id};
}

describe('USER API', () => {
    describe('POST /user', () => {

        it('should register correct user correctly', async () => {
            const name = nanoid(10);
            const email = nanoid(10) + '@email.com';
            const password = nanoid(10);
            const response = await request(app).post(`${apiBase}/user`).send({
                name,
                email,
                password,
            });
            const databaseEntry = await User.getByEmail(email);
            expect(response.status).toBe(200);
            expect(databaseEntry).toBeTruthy();
            expect(databaseEntry.password).toBeUndefined();
            expect(databaseEntry.passwordHash).not.toBe(password);
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
            const email = nanoid(10) + '@email.com';
            let response = await request(app).post(`${apiBase}/user`).send({
                name: 'Test user',
                email,
                password: 'password123',
            });

            expect(response.status).toBe(200);
            response = await request(app).post(`${apiBase}/user`).send({
                name: 'Test user',
                email,
                password: 'password123',
            });

            expect(response.status).toBe(500);
        });
        it('should give token pair', async () => {
            const name = nanoid(10);
            const email = nanoid(10) + '@email.com';
            const password = nanoid(10);
            const response = await request(app).post(`${apiBase}/user`).send({
                name,
                email,
                password,
            });
            expect(response.status).toBe(200);
            expect(response.body).toBeTruthy();
            expect(response.body.accessToken.length).toBeGreaterThan(0);
            expect(response.body.refreshToken.length).toBeGreaterThan(0);
        });
    });
    describe('POST /user/login', () => {
        it('should login correct user correctly', async () => {
            const name = nanoid(10);
            const email = nanoid(10) + '@email.com';
            const password = nanoid(10);
            await request(app).post(`${apiBase}/user`).send({
                name,
                email,
                password,
            });
            const response = await request(app).post(`${apiBase}/user/login`).send({
                email,
                password,
            });
            expect(response.status).toBe(200);
            expect(response.body).toBeTruthy();
            expect(response.body.accessToken.length).toBeGreaterThan(0);
            expect(response.body.refreshToken.length).toBeGreaterThan(0);
        });

        it('should fail for incorrect user data', async () => {
            await request(app).post(`${apiBase}/user`).send({
                name: 'Test user',
                email: 'real@email.com',
                password: 'password',
            });
            let response = await request(app).post(`${apiBase}/user/login`).send({
                email: 'test@email.com',
                password: 'password',
            });
            expect(response.status).toBe(500);
            response = await request(app).post(`${apiBase}/user/login`).send({
                email: 'testx@email.com',
                password: 'wrongpassword',
            });
            expect(response.status).toBe(500);
        });
    });
    describe('PUT /user', () => {
        it('should update correctly', async () => {
            const name = nanoid(10);
            const email = nanoid(10) + '@email.com';
            const password = nanoid(10);

            //register
            const { body: tokens } = await request(app).post(`${apiBase}/user`).send({
                name,
                email,
                password,
            });

            const databaseEntry = await User.getByEmail(email);
            const { accessToken, refreshToken } = tokens;

            const newName = nanoid(10);
            const newEmail = nanoid(10) + '@email.com';
            const newPassword = nanoid(10);

            const response = await request(app).put(`${apiBase}/user`)
                .set('access-token', accessToken)
                .set('refresh-token', refreshToken).send({
                    name: newName,
                    email: newEmail,
                    password: newPassword,
                });

            expect(response.status).toBe(200);
            expect(response.body).toBeTruthy();

            const user = await User.get(databaseEntry.id) as User;
            expect(user.name).toBe(newName);
            expect(user.email).toBe(newEmail);
        });

        it('should update only parts correctly', async () => {
            const name = nanoid(10);
            const email = nanoid(10) + '@email.com';
            const password = nanoid(10);

            //register
            const { body: tokens } = await request(app).post(`${apiBase}/user`).send({
                name,
                email,
                password,
            });
            const databaseEntry = await User.getByEmail(email);
            const { accessToken, refreshToken } = tokens;

            const newName = nanoid(10);

            const response = await request(app).put(`${apiBase}/user`)
                .set('access-token', accessToken)
                .set('refresh-token', refreshToken)
                .send({
                    name: newName,
                });
            expect(response.status).toBe(200);
            expect(response.body).toBeTruthy();

            const user = await User.get(databaseEntry.id) as User;
            expect(user.name).toBe(newName);
            expect(user.email).toBe(email);
        });

        it('should fail for incorrect user data', async () => {
            const name = nanoid(10);
            const email = nanoid(10) + '@email.com';
            const password = nanoid(10);

            //register
            const { body: tokens } = await request(app).post(`${apiBase}/user`).send({
                name,
                email,
                password,
            });
            const { accessToken, refreshToken } = tokens;

            let response = await request(app).put(`${apiBase}/user`)
                .set('access-token', accessToken)
                .set('refresh-token', refreshToken)
                .send({
                    email: 'test.com',
                    password: 'passw',
                });
            expect(response.status).toBe(500);
        });
        it('should fail for no authorization', async () => {
            let response = await request(app).put(`${apiBase}/user`)
                .send({
                    email: 'test@email.com',
                    password: 'passwor',
                });
            expect(response.status).toBe(401);
        });
    });
    describe('GET /user', () => {

        it('should get correct user', async () => {
            const name = nanoid(10);
            const email = nanoid(10) + '@email.com';
            const password = nanoid(10);

            const { body: tokens } = await request(app).post(`${apiBase}/user`).send({
                name,
                email,
                password,
            });

            const { accessToken, refreshToken } = tokens;
            const response = await request(app).get(`${apiBase}/user`)
                .set('access-token', accessToken)
                .set('refresh-token', refreshToken)
                .send();
            expect(response.status).toBe(200);
            expect(response.body).toBeTruthy();
            expect(response.body.name).toBe(name);
            expect(response.body.email).toBe(email);
            expect(response.body.passwordHash).toBeUndefined();
        });

        it('should fail for no authorization', async () => {
            let response = await request(app).get(`${apiBase}/user`)
                .send();
            expect(response.status).toBe(401);
        });
    });
});
