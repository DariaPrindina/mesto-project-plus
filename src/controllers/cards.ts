import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import { IUserReq } from '../models/user';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

export const deleteCardById = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => {
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
      res.send(card);
    })
    .catch(next);
};