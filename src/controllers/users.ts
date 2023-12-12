import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import User, { IUserReq } from '../models/user';
import IncorrectDataError from '../errors/incorrectDataError';
import NotFoundError from '../errors/notfound';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
      }
      return next(error);
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new IncorrectDataError('Переданы некорректные данные'));
      }
      next(error);
    });
};

export const updateProfile = (req: IUserReq, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const userId = req.user?._id;
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new IncorrectDataError('Переданы некорректные данные'));
      }
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
      }
      next(error);
    });
};

export const updateAvatar = (req: IUserReq, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const userId = req.user?._id;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new IncorrectDataError('Переданы некорректные данные'));
      }
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
      }
      next(error);
    });
};