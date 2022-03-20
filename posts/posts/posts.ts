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
  imageURL: Sequelize.STRING,
});

async function getAllPosts() {
  const results = await sequelize.query(
    "SELECT * FROM posts order by time_created desc"
  );
  console.log(results);
  return results;
}

async function getAnIndividualPost(postID: string) {
  const query =
    "SELECT * FROM posts where post_id=" +
    postID +
    " order by time_created desc";
  const results = await sequelize.query(query);
  console.log(results);
  return results;
}

async function getPostsByAnIndividual(userID: string) {
  const query =
    "SELECT * FROM posts where author=" +
    userID +
    " order by time_created desc";
  const results = await sequelize.query(query);
  console.log(results);
  return results;
}

async function createPost(
  author: string,
  title: string,
  content: string,
  imageURL?: string
) {
  let query;
  if (imageURL === "") {
    query =
      "INSERT INTO posts (author, title, content, time_created, image_url) values ('" +
      author +
      "', '" +
      title +
      "', '" +
      content +
      "', ' '";
  } else {
    query =
      "INSERT INTO posts (author, title, content, time_created, image_url) values ('" +
      author +
      "', '" +
      title +
      "', '" +
      content +
      "', '" +
      imageURL +
      "'";
  }
  const results = await sequelize.query(query);
  console.log(results);
  return results.data[0].id;

  // author will be req.user.id once auth is done
}

async function deletePost(postID: string) {
  const query = "DELETE FROM posts where postID=" + postID;
  const results = await sequelize.query(query);
  console.log(results);
  return results;
}

async function modifyPost(postID: string) {
  const query = "UPDATE posts set ....... where postID=" + postID;
  const results = await sequelize.query(query);
  console.log(results);
  return results;
}

export default {
  getAllPosts,
  getAnIndividualPost,
  getPostsByAnIndividual,
  createPost,
  modifyPost,
  deletePost,
};
