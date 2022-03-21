import AppError from '../interfaces/AppError';
import { NextFunction, Request, Response } from 'express';
import posts from '../models/posts/posts';

interface validationStatus {
  valid: boolean;
  error: string;
  value?: any;
}

export const validateTitle = (
  titleRaw: string,
  typeValidation: string,
): validationStatus => {
  let error: string;
  if (!titleRaw) {
    return {
      valid: false,
      error: typeValidation + ' is a required field',
      value: titleRaw,
    };
  }
  if (titleRaw.length < 3 || titleRaw.length > 500) {
    error = typeValidation + ' must be between 3 and 500 characters';
  }
  return { valid: !Boolean(error), error, value: titleRaw };
};

export const validatePostFields = (req: Request) => {
  const {
    author: authorRaw,
    title: titleRaw,
    content: contentRaw,
    imageURL: imageURLRaw,
  } = req.body;

  const errors = [];
  const titleErr = validateTitle(titleRaw, 'Title');
  const contentErr = validateTitle(contentRaw, 'Content');
  if (!titleErr.valid) {
    errors.push(titleErr.error);
  }
  if (!contentErr.valid) {
    errors.push(contentErr.error);
  }
  if (errors.length > 0) {
    throw new AppError(
      `There were some errors trying to create your post. There were ${errors.length} errors`,
      401,
      { validationErrors: errors },
    );
  }
  return {
    author: authorRaw,
    title: titleRaw,
    content: contentRaw,
    imageURL: imageURLRaw,
  };
};

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      title: titleRaw,
      content: contentRaw,
      imageURL: imageURLRaw,
    } = validatePostFields(req.body);
    const user = String(req.user);
    const postID = await posts.createPost(
      user,
      titleRaw,
      contentRaw,
      imageURLRaw,
    );
    res.status(200).json({
      status: 'success',
      postID: postID,
    });
  } catch (error) {
    next(error);
  }
};

export const getAnIndividualPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let post;
  const postID = req.params.post_id;
  try {
    post = await posts.getAnIndividualPost(postID);
  } catch (error) {
    next(error);
  }
};

export const searchPostByTitle = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let post;
  const postID = req.params.post_id;
  try {
    post = await posts.getAnIndividualPost(postID);
  } catch (error) {
    next(error);
  }
};

export const getPostsByAnIndividual = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let post;
  const userID = req.body.userID;
  try {
    post = await posts.getPostsByAnIndividual(userID);
  } catch (error) {
    next(error);
  }
};
export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let allPosts;
  try {
    allPosts = await posts.getAllPosts();
    res.status(200).json({
      allPosts: allPosts,
      status: 'success',
    });
  } catch (error) {
    next(error);
    return;
  }
};

export const modifyPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let allPosts;
  try {
    allPosts = await posts.getAllPosts();
    res.status(200).json({
      allPosts: allPosts,
      status: 'success',
    });
  } catch (error) {
    next(error);
    return;
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const postID = req.body.post_id;
  try {
    const allPosts = await posts.deletePost(postID);
    res.status(200).json({
      allPosts: allPosts,
      status: 'success',
    });
  } catch (error) {
    next(error);
    return;
  }
};

export default {
  getAllPosts,
  getAnIndividualPost,
  getPostsByAnIndividual,
  createPost,
  searchPostByTitle,
  modifyPost,
  deletePost,
};
