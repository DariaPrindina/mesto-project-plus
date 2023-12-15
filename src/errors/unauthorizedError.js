import { UNAUTHORIZED_ERROR_CODE } from '../utils/errors';

export default class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED_ERROR_CODE;
  }
}