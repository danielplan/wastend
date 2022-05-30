import { Router } from 'express';
import UserRoutes from './user.routes';
import HouseholdRoutes from './household.routes';

const router = Router();

router.use('/user', UserRoutes);
router.use('/household', HouseholdRoutes);

export default router;
