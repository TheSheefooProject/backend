import AppError from '../../authentication/src/api/v1/interfaces/AppError'
import { NextFunction, Request, Response } from 'express';
import posts from './posts';

export const validatePostFields=(req: Request) =>{
    const error = [];
  const {
    author: authorRaw,
    title: emailRaw,
    content: passwordRaw,
    imageURL: imageURLRaw
  } = req.body;
  
}

export const createPost = async(req: Request, res:Response, next:NextFunction):Promise<void>{
    const {
        title: titleRaw, content: contentRaw, imageURL:imageURLRaw
    } = req.body;
try {
    posts.createPost(req.user, titleRaw, contentRaw, imageURLRaw)
} catch (error) {
    next(error);
}
}


export default{
    createPost
}


