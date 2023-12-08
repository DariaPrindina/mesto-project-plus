import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import { IUserReq } from '../models/user';
import NotFoundError from '../errors/notfound';
import IncorrectDataError from '../errors/incorrectDataError';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .orFail()
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

export const deleteCardById = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      res.send(card);
    })
    .catch(next);
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
    .catch(next);
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
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      res.send(card);
    })
    .catch(next);
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
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      res.send(card);
    })
    .catch(next);
};