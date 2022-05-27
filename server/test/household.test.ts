import { nanoid } from 'nanoid';
import request from 'supertest';
import app from '../src/app';
import { apiBase } from './setupTest';
import { createTokens } from './user.test';
import Household from '../src/models/household.model';

describe('HOUSEHOLD API', () => {
    describe('POST /household', function() {
        it('should create a household', async () => {
            const name = nanoid(10);
            const { accessToken, refreshToken } = await createTokens();
            const response = await request(app).post(`${apiBase}/household`)
                .set('access-token', accessToken)
                .set('refresh-token', refreshToken)
                .send({
                    name,
                });

            const databaseEntry = await Household.get(response.body.id) as Household;
            expect(response.status).toBe(200);
            expect(databaseEntry).toBeTruthy();
            expect(databaseEntry.name).toBe(response.body.name);
            expect(databaseEntry.id).toBe(response.body.id);
        });
    });
    describe('PUT /household/:id', function() {
        it('should update a household', async () => {
            const name = nanoid(10);
            const { accessToken, refreshToken } = await createTokens();
            const { body: obj } = await request(app).post(`${apiBase}/household`)
                .set('access-token', accessToken)
                .set('refresh-token', refreshToken)
                .send({
                    name,
                });
            const newName = nanoid(10);
            const response = await request(app).put(`${apiBase}/household/${obj.id}`)
                .set('access-token', accessToken)
                .set('refresh-token', refreshToken)
                .send({
                    name: newName,
                });

            const databaseEntry = await Household.get(obj.id) as Household;
            expect(response.status).toBe(200);
            expect(databaseEntry).toBeTruthy();
            expect(databaseEntry.name).toBe(newName);
            expect(databaseEntry.name).not.toBe(name);
        });
        it('should fail update if not member', async () => {
            const name = nanoid(10);
            const { accessToken, refreshToken } = await createTokens();
            const { accessToken: accessToken2, refreshToken: refreshToken2 } = await createTokens();
            const { body: obj } = await request(app).post(`${apiBase}/household`)
                .set('access-token', accessToken)
                .set('refresh-token', refreshToken)
                .send({
                    name,
                });
            const newName = nanoid(10);
            const response = await request(app).put(`${apiBase}/household/${obj.id}`)
                .set('access-token', accessToken2)
                .set('refresh-token', refreshToken2)
                .send({
                    name: newName,
                });

            expect(response.status).toBe(401);
        });
    });
    describe('POST /household/join/:id', function() {
        it('should add member to household', async () => {
        });
    });
    describe('GET /household', function() {
        it('should create get all the households', async () => {
            const name1 = nanoid(10);
            const name2 = nanoid(10);
            const { accessToken, refreshToken } = await createTokens();
            const { body: obj1 } = await request(app).post(`${apiBase}/household`)
                .set('access-token', accessToken)
                .set('refresh-token', refreshToken)
                .send({
                    name: name1,
                });
            const { body: obj2 } = await request(app).post(`${apiBase}/household`)
                .set('access-token', accessToken)
                .set('refresh-token', refreshToken)
                .send({
                    name: name2,
                });
            const response = await request(app).get(`${apiBase}/household`)
                .set('access-token', accessToken)
                .set('refresh-token', refreshToken)
                .send();

            expect(response.status).toBe(200);
            expect(response.body).toBeTruthy();
            expect(response.body[0].name).toBe(name1);
            expect(response.body[1].name).toBe(name2);
            expect(response.body[0].id).toBe(obj1.id);
            expect(response.body[1].id).toBe(obj2.id);
        });
    });
});