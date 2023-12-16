import { NOT_FOUND_CODE } from '../utils/statusCodes';

export default class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND_CODE;
  }
}