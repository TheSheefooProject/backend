import express from "express";
import postsController from "./postsController";

const postsRouter = express.router();

postsRouter.route("/all").get(postsController.getAllPosts);
