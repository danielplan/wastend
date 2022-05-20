import { close, migrate } from '../src/database';

beforeAll(async () => {
    await migrate();
});

afterAll(async () => {
    await close();
});