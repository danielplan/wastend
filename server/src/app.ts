import express, { Express } from 'express';
import dotenv from 'dotenv';
import AppRouter from './routes';
import handleErrors from './middlewares/error_handler.middleware';

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use('/', AppRouter);
app.use(handleErrors);

export default app;
