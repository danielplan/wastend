import { Router } from 'express';
import { loginController, registerController, updateUserController } from '../controllers/user.controller';

const router = Router();

router.post('/', registerController);
router.post('/login', loginController);
router.put('/:id', updateUserController);

export default router;
