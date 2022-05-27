import { close, migrate } from '../src/database';
export const apiBase = '';

beforeAll(async () => {
    await migrate();
});

afterAll(async () => {
    await close();
});