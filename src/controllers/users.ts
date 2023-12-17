import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User, { IUserReq } from '../models/user';
import IncorrectDataError from '../errors/incorrectDataError';
import NotFoundError from '../errors/notfound';
import UnauthorizedError from '../errors/unauthorizedError';
import ConflictError from '../errors/conflictError';
import { CREATED_CODE } from '../utils/statusCodes';

const { NODE_ENV, JWT_SECRET } = process.env;

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
        return;
      }
      next(error);
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({ name, about, avatar, email, password: hash })
        .then((user) => {
          res
            .status(CREATED_CODE)
            .send({
              _id: user._id,
              name: user.name,
              about: user.about,
              avatar: user.avatar,
              email: user.email,
            });
        })
        .catch((error) => {
          if (error.code === 11000) {
            next(new ConflictError('Пользователь с этим email уже существует'));
            return;
          }
          if (error instanceof mongoose.Error.ValidationError) {
            next(new IncorrectDataError('Переданы некорректные данные'));
            return;
          }
          next(error);
        });
    })
    .catch(next);
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
        return;
      }
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
        return;
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
        return;
      }
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
        return;
      }
      next(error);
    });
};

export const login = (req: IUserReq, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user: any) => {
      const secretCode = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';
      const token = jwt.sign(
        { _id: user._id },
        `${secretCode}`,
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError('Неправильные почта или пароль'));
    });
};

export const getCurrentUser = (req: IUserReq, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
        return;
      }
      next(error);
    });
};