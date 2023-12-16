import { CONFLICT_ERROR_CODE } from '../utils/statusCodes';

export default class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT_ERROR_CODE;
  }
}