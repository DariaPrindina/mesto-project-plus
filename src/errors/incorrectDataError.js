import { INCORRECT_DATA_CODE } from '../utils/statusCodes';

export default class IncorrectDataError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INCORRECT_DATA_CODE;
  }
}