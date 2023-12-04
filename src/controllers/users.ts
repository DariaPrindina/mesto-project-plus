import { Request, Response, NextFunction } from 'express';

import User, { IUserReq } from '../models/user';
import NotFoundError from '../errors/notfound';
import IncorrectDataError from '../errors/incorrectDataError';
import DefaultError from '../errors/defaultError';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new DefaultError('Ошибка на сервере');
      }
      res.send(users);
    })
    .catch(() => next(new DefaultError('Ошибка на сервере')));
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.send(user);
    })
    .catch(() => next(new DefaultError('Ошибка на сервере')));
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => {
      if (!user) {
        throw new IncorrectDataError('Ошибка в корректности данных');
      }
      res.send(user);
    })
    .catch(() => next(new DefaultError('Ошибка на сервере')));
};

export const updateProfile = (req: IUserReq, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const userId = req.user?._id;
  if (!name && !about) {
    throw new IncorrectDataError('Ошибка в корректности данных');
  }
  User.findByIdAndUpdate(userId, { name, about }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.send(user);
    })
    .catch(() => next(new DefaultError('Ошибка на сервере')));
};

export const updateAvatar = (req: IUserReq, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const userId = req.user?._id;
  if (!avatar) {
    throw new IncorrectDataError('Переданы некорректные данные при обновлении аватара');
  }
  User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.send(user);
    })
    .catch(() => next(new DefaultError('Ошибка на сервере')));
};