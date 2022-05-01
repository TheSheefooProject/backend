export default class AppError extends Error {
  statusCode;
  message;
  additionalFields;
  isAdditionalFieldsPresent = false;
  constructor(
    message = 'Internal server error',
    statusCode = 500,
    additionalFields = {}
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.additionalFields = additionalFields;
    if (Object.keys(additionalFields).length !== 0) {
      this.isAdditionalFieldsPresent = true;
    }
    Error.captureStackTrace(this, this.constructor);
  }
}
