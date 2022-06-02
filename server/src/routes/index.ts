import { Router } from 'express';
import UserRoutes from './user.routes';
import HouseholdRoutes from './household.routes';
import InventoryRoutes from './inventory.routes';

const router = Router();

router.use('/user', UserRoutes);
router.use('/household', HouseholdRoutes);
router.use('/inventory', InventoryRoutes);

export default router;
