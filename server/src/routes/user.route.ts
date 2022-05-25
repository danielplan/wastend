import { Router } from 'express';
import { loginController, registerController, updateUserController } from '../controllers/user.controller';
import requireAuth from '../middlewares/auth.middleware';

const router = Router();

router.post('/', registerController);
router.post('/login', loginController);
router.put('/', requireAuth, updateUserController);

export default router;
