import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import { IUserReq } from '../models/user';
import IncorrectDataError from '../errors/incorrectDataError';
import NotFoundError from '../errors/notfound';
import ForbiddenError from '../errors/forbiddenError';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

export const deleteCardById = (req: IUserReq, res: Response, next: NextFunction) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => {
      const ownerId = card.owner;
      const userId = req.user?._id;
      if (ownerId.toString() !== userId) {
        next(new ForbiddenError('Недостаточно прав, чтобы запрос прошёл успешно'));
      }
      res.send(card);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        next(new IncorrectDataError('Переданы некорректные данные'));
      }
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Карточка с указанным id не найдена'));
      }
      return next(error);
    });
};

export const createCard = (req: IUserReq, res: any, next: NextFunction) => {
  const { name, link } = req.body;
  const userId = req.user?._id;
  return Card.create({ name, link, owner: userId })
    .then((card) => {
      res.send(card);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new IncorrectDataError('Переданы некорректные данные'));
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
      }
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Карточка с указанным id не найдена'));
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
      }
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Карточка с указанным id не найдена'));
      }
      next(error);
    });
};