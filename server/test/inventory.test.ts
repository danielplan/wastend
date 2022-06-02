import { nanoid } from 'nanoid';
import request from 'supertest';
import app from '../src/app';
import { apiBase } from './setupTest';
import { createHousehold } from './household.test';
import Stock from '../src/models/stock.model';
import Grocery from '../src/models/grocery.model';

describe('Inventory API', () => {
    describe('POST /inventory', function() {
        it('should create a grocery item', async () => {
            const name = nanoid(10);
            const idealAmount = 10;
            const unit = 'kg';
            const amount = 0;
            const { household, accessToken, refreshToken } = await createHousehold();

            const response = await request(app).post(`${apiBase}/inventory`)
                .set('access-token', accessToken)
                .set('refresh-token', refreshToken)
                .send({
                    name,
                    idealAmount,
                    unit,
                    amount,
                    householdId: household.id
                });
            expect(response.status).toBe(200);
            expect(response.body.grocery.name).toBe(name);
            expect(response.body.stock.unit).toBe(unit);
            expect(response.body.stock.amount).toBe(amount);
            expect(response.body.stock.idealAmount).toBe(idealAmount);
            const stock = await Stock.get(response.body.stock.id) as Stock;
            expect(stock.amount).toBe(amount);
            expect(stock.idealAmount).toBe(idealAmount);
            expect(stock.unit).toBe(unit);
            const grocery = await Grocery.get(response.body.grocery.id) as Grocery;
            expect(grocery.name).toBe(name);
        });
        it('should should fail for strings instead of items', async () => {
            const name = nanoid(10);
            const idealAmount = 'x';
            const unit = 'kg';
            const amount = 0;
            const { household, accessToken, refreshToken } = await createHousehold();

            const response = await request(app).post(`${apiBase}/inventory`)
                .set('access-token', accessToken)
                .set('refresh-token', refreshToken)
                .send({
                    name,
                    idealAmount,
                    unit,
                    amount,
                    householdId: household.id
                });
            expect(response.status).toBe(500);
        });
        it('should reuse grocery items', async () => {
            const name = nanoid(10);
            const idealAmount = 10;
            const unit = 'kg';
            const amount = 5;
            const { household, accessToken, refreshToken } = await createHousehold();
            const { household: h2, accessToken: at2, refreshToken: rt2 } = await createHousehold();

            const response = await request(app).post(`${apiBase}/inventory`)
                .set('access-token', accessToken)
                .set('refresh-token', refreshToken)
                .send({
                    name,
                    idealAmount,
                    unit,
                    amount,
                    householdId: household.id
                });
            const response2 = await request(app).post(`${apiBase}/inventory`)
                .set('access-token', at2)
                .set('refresh-token', rt2)
                .send({
                    name,
                    idealAmount,
                    unit,
                    amount,
                    householdId: h2.id
                });
            expect(response.status).toBe(200);
            expect(response2.status).toBe(200);
            expect(response.body.grocery.id).toBe(response2.body.grocery.id);
            expect(response.body.stock.id).not.toBe(response2.body.stock.id);
        });
        it('should fail if add grocery inaccessible household', async () => {
            const name = nanoid(10);
            const idealAmount = 10;
            const unit = 'kg';
            const amount = 5;
            const { household, accessToken, refreshToken } = await createHousehold();
            const { accessToken: at2, refreshToken: rt2 } = await createHousehold();

            const response = await request(app).post(`${apiBase}/inventory`)
                .set('access-token', accessToken)
                .set('refresh-token', refreshToken)
                .send({
                    name,
                    idealAmount,
                    unit,
                    amount,
                    householdId: household.id
                });
            const response2 = await request(app).post(`${apiBase}/inventory`)
                .set('access-token', at2)
                .set('refresh-token', rt2)
                .send({
                    name,
                    idealAmount,
                    unit,
                    amount,
                    householdId: household.id
                });
            expect(response.status).toBe(200);
            expect(response2.status).toBe(401);
        });
        it('should fail if household not found', async () => {
            const name = nanoid(10);
            const idealAmount = 10;
            const unit = 'kg';
            const amount = 5;
            const { accessToken, refreshToken } = await createHousehold();

            const response = await request(app).post(`${apiBase}/inventory`)
                .set('access-token', accessToken)
                .set('refresh-token', refreshToken)
                .send({
                    name,
                    idealAmount,
                    unit,
                    amount,
                    householdId: 'not-found'
                });
            expect(response.status).toBe(404);
        });
    });
});
