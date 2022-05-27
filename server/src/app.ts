import express, { Express } from 'express';
import dotenv from 'dotenv';
import UserRoute from './routes/user.route';
import HouseholdRoute from './routes/household.route';

dotenv.config();

const app: Express = express();
app.use(express.json());

app.use('/user', UserRoute);
app.use('/household', HouseholdRoute);


export default app;
