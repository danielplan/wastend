import { Router } from 'express';
import { createHouseholdController, getHouseholdsController, updateHouseholdController } from '../controllers/household.controller';
import requireAuth from '../middlewares/auth.middleware';

const router = Router();

router.post('/', requireAuth, createHouseholdController);
router.get('/', requireAuth, getHouseholdsController);
router.put('/:id', requireAuth, updateHouseholdController);

export default router;
