// library for postgres 0.0.0.0:5432
import dbConfigPosts from '../../../../config/dbConfigPosts';
import { Sequelize, STRING, DATE, INTEGER, Op } from 'sequelize';
import AppError from '../../interfaces/AppError';

// import { NextFunction, Request, Response } from "express";

const sequelize = new Sequelize(
  dbConfigPosts.DB,
  dbConfigPosts.USER,
  dbConfigPosts.PASSWORD,
  {
    host: dbConfigPosts.HOST,
    dialect: 'postgres',
    pool: {
      max: dbConfigPosts.pool.max,
      min: dbConfigPosts.pool.min,
      acquire: dbConfigPosts.pool.acquire,
      idle: dbConfigPosts.pool.idle,
    },
  },
);

const Post = sequelize.define('post', {
  post_id: INTEGER,
  author: STRING,
  title: STRING,
  content: STRING,
  time_created: DATE,
  image_url: STRING,
});

const PostReply = sequelize.define('post_replies', {
  post_replies_id: INTEGER,
  author: STRING,
  reply_content: STRING,
  timestamp: DATE,
  post_id: INTEGER,
});

async function getPostReplies(postID: string) {
  const postReplies = PostReply.findAll({
    attributes: ['*'],
    where: { post_id: postID },
  });
  console.log(postReplies);

  return postReplies;
}

async function getPostReplybyID(postReplyID: string) {
  const postReplies = PostReply.findAll({
    attributes: ['*'],
    where: { post_replies_id: postReplyID },
  });
  if (!postReplies) {
    throw new AppError(`unable to find post reply for id ${postReplyID}`, 500);
  }
  console.log(postReplies);

  return postReplies;
}

async function createPostReply(
  author: string,
  content: string,
  postID: number,
) {
  const curtime = Date.now();
  const postExists = await Post.findOne({
    where: {
      post_id: postID,
    },
  });
  if (!postExists) {
    throw new AppError("Can't reply to a non-existing post", 500);
  }

  const postReplyExists = await PostReply.findOne({
    where: {
      author: author,
      reply_content: content,
      timestamp: curtime,
    },
  });
  if (postReplyExists) {
    throw new AppError('Post Reply already exists', 500);
  }
  const newPostReply = await PostReply.create(
    {
      author: author,
      reply_content: content,
      timestamp: curtime,
    },
    { returning: ['post_replies_id'] },
  );

  return JSON.stringify(newPostReply);

  // author will be req.user.id once auth is done
}

async function deletePostReply(postReplyID: string, author: string) {
  const post = await PostReply.findOne({
    where: {
      post_replies_id: postReplyID,
      author: author,
    },
  });
  if (!post) {
    throw new AppError(
      'Unable to find a post for the specified parameters',
      500,
    );
  }
  const results = await post.destroy();
  return JSON.stringify(results);
}

async function modifyPostReply(postReplyID: string, content: string) {
  if (!content) {
    throw new AppError('Please provide new content for post', 422);
  }
  const curtime = Date.now();
  let postReplyToModify;
  try {
    postReplyToModify = await PostReply.update(
      { reply_content: 'Edited: ' + content, timestamp: curtime },
      { where: { _post_reply_id: postReplyID } },
    ).then(function (result) {
      console.log(result);
    });
  } catch (error) {
    throw new AppError('unable to modify post reply', 500, error);
  }

  return postReplyToModify;
}

export default {
  getPostReplies,
  getPostReplybyID,
  modifyPostReply,
  deletePostReply,
  createPostReply,
};
