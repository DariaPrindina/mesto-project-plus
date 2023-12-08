import { Request, Response, NextFunction } from 'express';

import User, { IUserReq } from '../models/user';
import NotFoundError from '../errors/notfound';
import IncorrectDataError from '../errors/incorrectDataError';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .orFail()
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.send(user);
    })
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

export const updateProfile = (req: IUserReq, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const userId = req.user?._id;
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.send(user);
    })
    .catch(next);
};

export const updateAvatar = (req: IUserReq, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const userId = req.user?._id;
  if (!avatar) {
    throw new IncorrectDataError('Переданы некорректные данные при обновлении аватара');
  }
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.send(user);
    })
    .catch(next);
};