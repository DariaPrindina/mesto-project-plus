import express, { Response, Request, NextFunction } from 'express';
import mongoose, { Error } from 'mongoose';
import routes from './routes';
import { INTERNAL_SERVER_ERROR_CODE } from './utils/errors';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';

require('dotenv').config();

interface ResponseError extends Error {
  statusCode?: number;
}

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());

app.use(requestLogger);

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use(routes);

app.use(errorLogger);

app.use((err: ResponseError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = INTERNAL_SERVER_ERROR_CODE, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === INTERNAL_SERVER_ERROR_CODE
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`Открылся порт ${PORT} для связи с космосом`);
});