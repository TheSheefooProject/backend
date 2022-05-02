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
  const { title, content, imageURL } = req.body;

  const errors = [];
  const titleErr = validateTitle(title, 'Title');
  const contentErr = validateTitle(content, 'Content');
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
    title: title,
    content: content,
    imageURL: imageURL,
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
    } = validatePostFields(req);

    const first_hashtag = req.body.first_hashtag || '';
    const second_hashtag = req.body.second_hashtag || '';
    const third_hashtag = req.body.third_hashtag || '';
    // const second_hashtag = req.body._hashtag ? req.body.first_hashtag : '';
    // const third_hashtag = req.body.first_hashtag ? req.body.first_hashtag : '';
    const author = req.user.id;
    const postID = await posts.createPost(
      author,
      titleRaw,
      contentRaw,
      first_hashtag,
      second_hashtag,
      third_hashtag,
      imageURLRaw,
    );
    res.status(200).json({
      status: 'success',
      postID: JSON.parse(postID),
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
  let postID = req.params.post_id;

  postID = postID.substring(8); // Get rid of "post_id="  from request
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

  const title = req.params.titleSearch;
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
  const searchHashtag = req.params.search;

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
  const userID = req.params.userID;
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
    // res.status(200).json({ status: 'success' });
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

  const { title: title, content: content, imageURL: imageURL } = req.body;

  const postID = req.params.post_id.substring(8);
  try {
    const errors = [];
    const titleErr = validateTitle(title, 'Title');
    const contentErr = validateTitle(content, 'Content');
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
    const updatedimageURL = imageURL ? imageURL : '';
    Posts = await posts.modifyPost(postID, title, content, updatedimageURL);
    res.status(200).json({
      Posts: JSON.parse(Posts),
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
  const postID = req.params.post_id.substring(8);
  const user = String(req.user.id);
  try {
    const delPost = await posts.deletePost(postID, user);
    res.status(200).json({
      delPost: JSON.stringify(delPost),
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
