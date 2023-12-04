import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import { IUserReq } from '../models/user';
import NotFoundError from '../errors/notfound';
import IncorrectDataError from '../errors/incorrectDataError';
import DefaultError from '../errors/defaultError';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        throw new DefaultError('Ошибка на сервере');
      }
      res.send(cards);
    })
    .catch(() => next(new DefaultError('Ошибка на сервере')));
};

export const deleteCardById = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      res.send(card);
    })
    .catch(() => next(new DefaultError('Ошибка на сервере')));
};

export const createCard = (req: IUserReq, res: any, next: NextFunction) => {
  const { name, link } = req.body;
  console.log(req.user?._id);
  const userId = req.user?._id;
  return Card.create({ name, link, owner: userId })
    .then((card) => {
      if (!card) {
        throw new IncorrectDataError('Переданы некорректные данные при создании карточки');
      }
      res.send(card);
    })
    .catch(() => next(new DefaultError('Ошибка на сервере')));
};

export const likeCard = (req: any, res: any, next: NextFunction) => {
  const userId = req.user?._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      res.send(card);
    })
    .catch(() => next(new DefaultError('Ошибка на сервере')));
};

export const dislikeCard = (req: any, res: any, next: NextFunction) => {
  const userId = req.user?._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      res.send(card);
    })
    .catch(() => next(new DefaultError('Ошибка на сервере')));
};