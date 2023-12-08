import { Router, Request, Response, NextFunction } from 'express';
import userRouter from './users';
import cardRouter from './cards';
import NotFoundError from '../errors/notfound';

const router = Router();

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Такой страницы не существует'));
});

export default router;