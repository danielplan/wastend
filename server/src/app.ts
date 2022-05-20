import express, { Express } from 'express';
import dotenv from 'dotenv';
import UserRoute from './routes/user.route';

dotenv.config();

const app: Express = express();
app.use(express.json());

app.use('/user', UserRoute);


export default app;
