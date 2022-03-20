// library for postgres 0.0.0.0:5432
import dbConfig from "./db.config";
import { Sequelize } from "sequelize-typescript";
// import { NextFunction, Request, Response } from "express";

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

async function getPostReplies(postID: string) {
  const query =
    "SELECT * FROM post_replies where post_id= " +
    postID +
    "order by timestamp asc";
  const results = await sequelize.query(query);
  console.log(results);
  return results;
}

async function createPostReply(
  author: string,
  title: string,
  content: string,
  imageURL?: string
) {
  const query =
    "SELECT * FROM posts where author=" +
    author +
    " order by time_created desc";
  const results = await sequelize.query(query);

  console.log(results);
  return results;

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
