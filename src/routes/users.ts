import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { getUserById, getUsers, updateAvatar, updateProfile, getCurrentUser } from '../controllers/users';
import regExpUrl from '../utils/constants';

const router = Router();

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24),
  }),
}), getUserById);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(200).required(),
  }),
}), updateProfile);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(regExpUrl),
  }),
}), updateAvatar);

export default router;