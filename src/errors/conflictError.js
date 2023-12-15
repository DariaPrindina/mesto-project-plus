import { CONFLICT_ERROR_CODE } from '../utils/errors';

export default class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT_ERROR_CODE;
  }
}