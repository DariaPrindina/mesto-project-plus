import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import UnauthorizedError from '../errors/unauthorizedError';

const { JWT_SECRET } = process.env;

interface SessionRequest extends Request {
    user?: string | JwtPayload;
}

const extractBearerToken = (header: string) => header.replace('Bearer ', '');

export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Ошибка авторизации'));
    return;
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, `${JWT_SECRET}`);
  } catch (err) {
    next(new UnauthorizedError('Ошибка авторизации'));
    return;
  }

  req.user = payload;

  next();
};