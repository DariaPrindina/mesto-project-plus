import { Router } from 'express';
import { getUserById, getUsers, updateAvatar, updateProfile, getCurrentUser } from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUserById);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

export default router;