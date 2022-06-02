import { Router } from 'express';
import { addGroceryController } from '../controllers/inventory.controller';
import requireAuth from '../middlewares/auth.middleware';

const router = Router();

router.post('/', requireAuth, addGroceryController);

export default router;