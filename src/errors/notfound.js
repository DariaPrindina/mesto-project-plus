export default class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}