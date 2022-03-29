import { ErrorRequestHandler, Response } from 'express';
import AppError from '../interfaces/AppError';

const sendError = (error: AppError, res: Response) => {
    let responseData = { message: error.message, type: 'error' };
    if (error.isAdditionalFieldsPresent) {
        responseData = { ...responseData, ...error.additionalFields };
    }
    if (process.env.NODE_ENV === 'DEVELOPMENT') {
        console.warn(error);
        res.status(error.statusCode).json({
            ...responseData,
            stackTrace: error.stack,
        });
    } else {
        res.status(error.statusCode).json(responseData);
    }
};

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
    sendError(error, res);
};

export default globalErrorHandler;
