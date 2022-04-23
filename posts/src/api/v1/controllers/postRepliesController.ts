import AppError from '../interfaces/AppError';
import { NextFunction, Request, Response } from 'express';
import postsReplies from '../models/posts/postReplies';
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

export const validatePostRepliesFields = (
  contentRaw: string,
  postIdRaw: string,
) => {
  if (!posts.getAnIndividualPost(postIdRaw)) {
    throw new AppError('unable to find the post', 404);
  }
  const errors = [];
  const contentErr = validateTitle(contentRaw, 'Content');
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
    content: contentRaw,
    postId: postIdRaw,
  };
};

export const createPostReply = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const content = req.body.content;
    const postID = req.params.post_id;
    const { content: contentRaw, postId: PostIdRaw } =
      validatePostRepliesFields(content, postID);

    const postReplyId = await postsReplies.createPostReply(
      req.user.id,
      contentRaw,
      String(PostIdRaw.substring(8)),
    );
    res.status(200).json({ status: 'success', postReplyId: postReplyId });
  } catch (error) {
    next(error);
  }
};

export const getPostReplies = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let postRepliesForId;
  try {
    const postId = req.params.post_id;
    if (!postId) {
      throw new AppError('Please provide post id to find replies ', 400);
    }
    postRepliesForId = await postsReplies.getPostReplies(postId);
    res.status(200).json({ status: 'success', postReplies: postRepliesForId });
  } catch (error) {
    next(error);
    return;
  }
};

export const modifyPostReply = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let postReplyToModify;
  const { postReplyID: postReplyIDRaw, content: contentRaw } = req.body;
  if (contentRaw.length < 1) {
    throw new AppError('Please provide body for the reply', 500);
  }
  if (!postReplyIDRaw) {
    throw new AppError('Please provide post reply id to update ', 400);
  }
  try {
    postReplyToModify = await postsReplies.modifyPostReply(
      postReplyIDRaw,
      contentRaw,
    );
    res
      .status(200)
      .json({ status: 'success', postReplyToModify: postReplyToModify });
  } catch (error) {
    next(error);
  }
};

export const getPostReplybyID = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let postReply;
  try {
    const postReplyIDRaw = req.params.post_replies_id;
    if (!postReplyIDRaw) {
      throw new AppError('Please provide post reply id to update ', 400);
    }

    postReply = await postsReplies.getPostReplybyID(postReplyIDRaw);
    res.status(200).json({ status: 'success', postReply: postReply });
  } catch (error) {
    next(error);
  }
};

export const deletePostReply = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let postReplyToDelete;
  try {
    postReplyToDelete = await postsReplies.deletePostReply(
      req.params.post_replies_id,
      req.params.author,
    );
    res
      .status(200)
      .json({ status: 'success', postReplyToDelete: postReplyToDelete });
  } catch (error) {
    next(error);
  }
};

export default {
  createPostReply,
  getPostReplies,
  getPostReplybyID,
  modifyPostReply,
  deletePostReply,
};
