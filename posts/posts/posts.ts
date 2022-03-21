// library for postgres 0.0.0.0:5432
import dbConfigPosts from "../db.config";
// import { Sequelize } from "sequelize-typescript";
// import { NextFunction, Request, Response } from "express";
var Sequelize = require("sequelize");

const sequelize = new Sequelize(
  dbConfigPosts.DB,
  dbConfigPosts.USER,
  dbConfigPosts.PASSWORD,
  {
    host: dbConfigPosts.HOST,
    dialect: dbConfigPosts.dialect,
    pool: {
      max: dbConfigPosts.pool.max,
      min: dbConfigPosts.pool.min,
      acquire: dbConfigPosts.pool.acquire,
      idle: dbConfigPosts.pool.idle,
    },
  }
);

var Post = sequelize.define("post", {
  author: Sequelize.STRING,
  title: Sequelize.STRING,
  content: Sequelize.STRING,
  time_created: Sequelize.DATE,
  imageURL: Sequelize.STRING,
});

async function getAllPosts() {
  const posts = Post.findAll({
    attributes: ["*"],
    order: [["time_created", "DESC"]],
  });
  // const results = await sequelize.query(
  //   "SELECT * FROM posts order by time_created desc"
  // );
  console.log(posts);
  return posts;
}

async function getAnIndividualPost(postID: string) {
  const results = Post.findAll({
    attributes: ["*"],
    where: { post_id: postID },
  });
  // const query =
  //   "SELECT * FROM posts where post_id=" +
  //   postID +
  //   " order by time_created desc";
  // const results = await sequelize.query(query);
  console.log(results);
  return results;
}

async function getPostsByAnIndividual(userID: string) {
  // const query =
  //   "SELECT * FROM posts where author=" +
  //   userID +
  //   " order by time_created desc";
  // const results = await sequelize.query(query);
  const results = Post.findAll({
    attributes: ["*"],
    where: { author: userID },
    order: [["time_created", "DESC"]],
  });
  console.log(results);
  return results;
}

export const createPost = async (
  author: string,
  title: string,
  content: string,
  imageURL?: string
): Promise<string> => {
  var curtime = Date.now();
  var newPost;

  const postExists = await Post.findOne({
    where: {
      author: author,
      title: title,
      content: content,
      time_created: curtime,
    },
  });
  if (postExists) {
    throw new Error("Post already exists");
  }
  // let query;
  if (imageURL === "") {
    newPost = await Post.create({
      author: author,
      title: title,
      content: content,
      time_created: curtime,
    });
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
    newPost = await Post.create({
      author: author,
      title: title,
      content: content,
      time_created: curtime,
      imageURL: imageURL,
    });
    //   query =
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
  return newPost.id;

  // author will be req.user.id once auth is done
};

export const deletePost = async (postID: string): Promise<string> => {
  const post = await Post.findOne({
    where: {
      postID: postID,
    },
  });
  const results = await post.destroy();
  // const query = "DELETE FROM posts where postID=" + postID;
  // const results = await sequelize.query(query);
  // console.log(results);
  return results;
};

export const modifyPost = async (
  postID: string,
  author: string,
  title: string,
  content: string,
  imageURL?: string
): Promise<string> => {
  try {
    let post;
    if (imageURL === "") {
      post = Post.update(
        { title: title, content: content },
        { where: { _id: postID } }
      ).then(function (result) {
        console.log(result);
      });
    } else {
      post = Post.update(
        { title: title, content: content, imageURL: imageURL },
        { where: { _id: postID } }
      ).then(function (result) {
        console.log(result);
      });
    }
  } catch (error) {
    console.log("error updating post: " + postID + ", " + error);
  }
  return postID;
};

export default {
  getAllPosts,
  getAnIndividualPost,
  getPostsByAnIndividual,
  createPost,
  modifyPost,
  deletePost,
};
