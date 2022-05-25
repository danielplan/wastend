import { Router } from 'express';
import {
    getUserController,
    loginController,
    registerController,
    updateUserController,
} from '../controllers/user.controller';
import requireAuth from '../middlewares/auth.middleware';

const router = Router();

router.get('/', requireAuth, getUserController);
router.post('/', registerController);
router.put('/', requireAuth, updateUserController);
router.post('/login', loginController);

export default router;
