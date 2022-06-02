import { nanoid } from 'nanoid';
import request from 'supertest';
import app from '../src/app';
import { apiBase } from './setupTest';
import { createTokens, UserData } from './user.test';
import Household, { HouseholdData } from '../src/models/household.model';

export interface UserHouseholdData extends UserData {
    household: HouseholdData;
}

export async function createHousehold(): Promise<UserHouseholdData> {
    const name = nanoid(10);
    const userData = await createTokens();

    //register
    const { body: household } = await request(app).post(`${apiBase}/household`)
        .set('access-token', userData.accessToken)
        .set('refresh-token', userData.refreshToken)
        .send({
            name,
        });
    return {...userData, household};
}

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
        it('should fail if household does not exist', async () => {
            const { accessToken, refreshToken } = await createTokens();
            const name = nanoid(10);
            const response = await request(app).put(`${apiBase}/household/123`)
                .set('access-token', accessToken)
                .set('refresh-token', refreshToken)
                .send({
                    name,
                });

            expect(response.status).toBe(404);
        });
    });
    describe('POST /household/:id/join', function() {
        it('should add member to household', async () => {
            const name = nanoid(10);
            const { accessToken, refreshToken } = await createTokens();
            const { body: obj } = await request(app).post(`${apiBase}/household`)
                .set('access-token', accessToken)
                .set('refresh-token', refreshToken)
                .send({
                    name,
                });
            const household = await Household.get(obj.id) as Household;
            const { accessToken: accessToken1, refreshToken: refreshToken1, userId } = await createTokens();
            const response = await request(app).post(`${apiBase}/household/${household.id}/join`)
                .set('access-token', accessToken1)
                .set('refresh-token', refreshToken1)
                .send();
            expect(response.status).toBe(200);
            expect(await household.hasAccess(userId)).toBe(true);
            const { userId: userId2 } = await createTokens();
            expect(await household.hasAccess(userId2)).toBe(false);
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
    describe('DELETE /household/:id', function() {
        it('should create delete a specific household', async () => {
            const name = nanoid(10);
            const { accessToken, refreshToken } = await createTokens();
            const { body: household } = await request(app).post(`${apiBase}/household`)
                .set('access-token', accessToken)
                .set('refresh-token', refreshToken)
                .send({
                    name: name,
                });
            const h = await Household.get(household.id) as Household;
            expect(h).toBeTruthy();
            const response = await request(app).delete(`${apiBase}/household/${household.id}`)
                .set('access-token', accessToken)
                .set('refresh-token', refreshToken)
                .send();

            expect(response.status).toBe(200);
            const deletedH = await Household.get(household.id) as Household;
            expect(deletedH).toBeFalsy();
        });
    });

});
