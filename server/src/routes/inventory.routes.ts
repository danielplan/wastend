import { Router } from 'express';
import {
    addGroceryController,
    getInventoryController, getSimilarGroceriesController,
    updateStockController,
} from '../controllers/inventory.controller';
import requireAuth from '../middlewares/auth.middleware';

const router = Router();

router.post('/', requireAuth, addGroceryController);
router.put('/:id', requireAuth, updateStockController);
router.get('/:id', requireAuth, getInventoryController);
router.get('/suggestions/:name', getSimilarGroceriesController);

export default router;