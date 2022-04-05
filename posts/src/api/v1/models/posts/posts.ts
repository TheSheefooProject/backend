// library for postgres 0.0.0.0:5432
import AppError from '../../interfaces/AppError';
import dbConfigPosts from '../../../../config/dbConfigPosts';

require('sequelize-typescript');
import { Sequelize, STRING, DATE, INTEGER, Op } from 'sequelize';

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
  first_hashtag: STRING,
  second_hashtag: STRING,
  third_hashtag: STRING,
});

async function getAllPosts() {
  console.log('\n\n\n\n\n');
  console.log('dbConfigPosts', dbConfigPosts);
  console.log('\n\n\n\n\n');
  const posts = Post.findAll({
    attributes: ['*'],
    order: [['time_created', 'DESC']],
  });
  console.log(posts);
  return posts;
}

async function SearchAllPostsbyTitle(titleQuery: string) {
  const posts = Post.findAll({
    attributes: ['*'],
    where: {
      title: {
        [Op.substring]: titleQuery, // LIKE '%scien%'
      },
    },
  });
  console.log(posts);
  return posts;
}

async function SearchAllPostsbyHashtag(hashtag: string) {
  const posts = Post.findAll({
    attributes: ['*'],
    where: {
      [Op.or]: [
        {
          first_hashtag: {
            [Op.substring]: hashtag, // LIKE '%scien%'
          },
          second_hashtag: {
            [Op.substring]: hashtag, // LIKE '%scien%'
          },
          third_hashtag: {
            [Op.substring]: hashtag, // LIKE '%scien%'
          },
        },
      ],
    },
  });
  console.log(posts);
  return posts;
}

async function getAnIndividualPost(postID: string) {
  const results = Post.findAll({
    attributes: ['*'],
    where: { post_id: postID },
  });
  console.log(results);
  return results;
}

async function getPostsByAnIndividual(userID: string) {
  const results = Post.findAll({
    attributes: ['*'],
    where: { author: userID },
    order: [['time_created', 'DESC']],
  });
  console.log(results);
  return results;
}

export const createPost = async (
  author: string,
  title: string,
  content: string,
  first_hashtag: string,
  second_hashtag: string,
  third_hashtag: string,
  imageURL?: string,
): Promise<string> => {
  const curtime = Date.now();
  let newPost;

  const postExists = await Post.findOne({
    where: {
      author: author,
      title: title,
      content: content,
      time_created: curtime,
    },
  });
  if (postExists) {
    throw new AppError('Post already exists', 500);
  }
  if (imageURL === '') {
    newPost = await Post.create(
      {
        author: author,
        title: title,
        content: content,
        time_created: curtime,
        first_hashtag: first_hashtag,
        second_hashtag: second_hashtag,
        third_hashtag: third_hashtag,
      },
      { returning: ['post_id'] },
    );
    // TODO: maybe add a random stock image if no image
    // query =
    //   "INSERT INTO posts (author, title, content, time_created, image_url) values ('" +
    //   author +
    //   "', '" +
    //   title +
    //   "', '" +
    //   content +
    //   "', ' '";
  } else {
    newPost = await Post.create(
      {
        author: author,
        title: title,
        content: content,
        time_created: curtime,
        imageURL: imageURL,
      },
      { returning: ['post_id'] },
    ); //   query =
    //     "INSERT INTO posts (author, title, content, time_created, image_url) values ('" +
    //     author +
    //     "', '" +
    //     title +
    //     "', '" +
    //     content +
    //     "', '" +
    //     imageURL +
    //     "'";
  }
  // const results = await sequelize.query(query);
  console.log(newPost);
  return JSON.stringify(newPost);

  // author will be req.user.id once auth is done
};

export const deletePost = async (
  postID: string,
  curUser: string,
): Promise<string> => {
  let results;
  try {
    const post = await Post.findOne({
      where: {
        postID: postID,
        author: curUser,
      },
    });
    if (!post) {
      throw new AppError('Post to delete is not found', 404);
    }
    results = await post.destroy();
  } catch (error) {
    throw new AppError('Post being deleted doesnt exist', 500);
  } // const query = "DELETE FROM posts where postID=" + postID;
  // const results = await sequelize.query(query);
  // console.log(results);
  return JSON.stringify(results);
};

export const modifyPost = async (
  postID: string,
  author: string,
  title: string,
  content: string,
  imageURL?: string,
): Promise<string> => {
  let postToModify;
  try {
    if (imageURL === '') {
      postToModify = await Post.update(
        { title: title, content: content },
        { where: { _id: postID } },
      ).then(function (result) {
        console.log(result);
      });
    } else {
      postToModify = await Post.update(
        { title: title, content: content, imageURL: imageURL },
        { where: { _id: postID } },
      ).then(function (result) {
        console.log(result);
      });
    }
  } catch (error) {
    console.log('error updating post: ' + postID + ', ' + error);
    throw new AppError('unable to update post', 500, error);
  }
  const res = JSON.stringify(postToModify);
  return res;
};

export default {
  Post,
  getAllPosts,
  getAnIndividualPost,
  SearchAllPostsbyTitle,
  SearchAllPostsbyHashtag,
  getPostsByAnIndividual,
  createPost,
  modifyPost,
  deletePost,
};
