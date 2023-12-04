export default class IncorrectDataError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}