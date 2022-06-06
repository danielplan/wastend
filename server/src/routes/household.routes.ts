import { Router } from 'express';
import {
    createHouseholdController,
    deleteHouseholdController,
    getHouseholdsController,
    joinHouseholdController,
    updateHouseholdController,
} from '../controllers/household.controller';
import requireAuth from '../middlewares/auth.middleware';


const router = Router();

router.post('/', requireAuth, createHouseholdController);
router.get('/', requireAuth, getHouseholdsController);
router.put('/:id', requireAuth, updateHouseholdController);
router.delete('/:id', requireAuth, deleteHouseholdController);
router.post('/:id/join', requireAuth, joinHouseholdController);

export default router;
