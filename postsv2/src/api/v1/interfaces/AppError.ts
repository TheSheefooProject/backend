export default class AppError extends Error {
    statusCode: number;
    message: string;
    additionalFields?: any;
    isAdditionalFieldsPresent = false;
    constructor(
        message: string = 'Internal server error',
        statusCode: number = 500,
        additionalFields = {},
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
