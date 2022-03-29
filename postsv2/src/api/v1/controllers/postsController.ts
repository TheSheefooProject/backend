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
    const first_hashtag = req.body.first_hashtag ? req.body.first_hashtag : '';
    const second_hashtag = req.body.first_hashtag ? req.body.first_hashtag : '';
    const third_hashtag = req.body.first_hashtag ? req.body.first_hashtag : '';
    const user = String(req.user);
    const postID = await posts.createPost(
      user,
      titleRaw,
      contentRaw,
      imageURLRaw,
      first_hashtag,
      second_hashtag,
      third_hashtag,
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
  if (!postID) {
    throw new AppError('please provide a post id', 400);
  }
  try {
    post = await posts.getAnIndividualPost(postID);
    res.status(200).json({ status: 'success', post: post });
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
  const title = req.params.title;
  if (!title) {
    throw new AppError('please provide missing title criteria', 400);
  }
  try {
    post = await posts.SearchAllPostsbyTitle(title);
    res.status(200).json({ status: 'success', post: post });
  } catch (error) {
    next(error);
  }
};

export const SearchAllPostsbyHashtag = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let postResults;
  const searchHashtag = req.params.hashtag;
  if (searchHashtag === '') {
    throw new AppError('Please provide a hashtag to search for', 400);
  }
  if (searchHashtag.length > 50) {
    throw new AppError('Please enter a hashtag less than 50 characters', 422);
  }

  try {
    postResults = await posts.SearchAllPostsbyHashtag(searchHashtag);
    res.status(200).json({ status: 'success', postResults: postResults });
  } catch (error) {
    next(error);
  }
};

export const getPostsByAnIndividual = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let postsByIndividual;
  const userID = req.body.userID;
  // TODO: check userid exists
  if (!userID) {
    throw new AppError('Invalid user id supplied', 400);
  }
  try {
    postsByIndividual = await posts.getPostsByAnIndividual(userID);
    res
      .status(200)
      .json({ status: 'success', postsByIndividual: postsByIndividual });
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
  let Posts;
  const {
    author: authorRaw,
    title: TitleRaw,
    content: ContentRaw,
    imageURL: imageURLRaw,
  } = validatePostFields(req.body);
  const postID = req.body.postID;
  try {
    Posts = await posts.modifyPost(
      postID,
      authorRaw,
      TitleRaw,
      ContentRaw,
      imageURLRaw,
    );
    res.status(200).json({
      Posts: Posts,
      postID: postID,
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
  const user = String(req.user);
  try {
    const delPost = await posts.deletePost(postID, user);
    res.status(200).json({
      delPost: delPost,
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
  SearchAllPostsbyHashtag,
  modifyPost,
  deletePost,
};
