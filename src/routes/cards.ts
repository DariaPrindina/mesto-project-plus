import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import regExpUrl from '../utils/constants';

import {
  createCard,
  getCards,
  deleteCardById,
  likeCard,
  dislikeCard,
} from '../controllers/cards';

const router = Router();

router.get('/', getCards);
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24),
  }),
}), deleteCardById);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().pattern(regExpUrl),
  }),
}), createCard);
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24),
  }),
}), likeCard);
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24),
  }),
}), dislikeCard);

export default router;