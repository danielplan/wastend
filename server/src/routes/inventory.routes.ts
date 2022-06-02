import { Router } from 'express';
import { addGroceryController, updateStockController } from '../controllers/inventory.controller';
import requireAuth from '../middlewares/auth.middleware';

const router = Router();

router.post('/', requireAuth, addGroceryController);
router.put('/:id', requireAuth, updateStockController);

export default router;