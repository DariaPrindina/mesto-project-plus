import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import { IUserReq } from '../models/user';
import IncorrectDataError from '../errors/incorrectDataError';
import NotFoundError from '../errors/notfound';
import ForbiddenError from '../errors/forbiddenError';
import { CREATED_CODE, OK_CODE } from '../utils/statusCodes';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

export const deleteCardById = (req: IUserReq, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail()
    .then((card) => {
      const ownerId = card.owner;
      const userId = req.user?._id;
      if (ownerId.toString() !== userId) {
        next(new ForbiddenError('Недостаточно прав, чтобы запрос прошёл успешно'));
        return;
      }
      Card.deleteOne()
        .then((item) => {
          res
            .status(OK_CODE)
            .send(item);
        })
        .catch(next);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        next(new IncorrectDataError('Переданы некорректные данные'));
        return;
      }
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Карточка с указанным id не найдена'));
        return;
      }
      next(error);
    });
};

export const createCard = (req: IUserReq, res: any, next: NextFunction) => {
  const { name, link } = req.body;
  const userId = req.user?._id;
  return Card.create({ name, link, owner: userId })
    .then((card) => {
      res
        .status(CREATED_CODE)
        .send(card);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new IncorrectDataError('Переданы некорректные данные'));
        return;
      }
      next(error);
    });
};

export const likeCard = (req: any, res: any, next: NextFunction) => {
  const userId = req.user?._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.send(card);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        next(new IncorrectDataError('Переданы некорректные данные'));
        return;
      }
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Карточка с указанным id не найдена'));
        return;
      }
      next(error);
    });
};

export const dislikeCard = (req: any, res: any, next: NextFunction) => {
  const userId = req.user?._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.send(card);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        next(new IncorrectDataError('Переданы некорректные данные'));
        return;
      }
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Карточка с указанным id не найдена'));
        return;
      }
      next(error);
    });
};