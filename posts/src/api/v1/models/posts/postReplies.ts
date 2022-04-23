// library for postgres 0.0.0.0:5432
import AppError from '../../interfaces/AppError';
import postReplyModel from '../../../../db/postReplies';
import posts from './posts';
import mongoose from 'mongoose';

async function getPostReplies(postID: string) {
  const postReplies = await postReplyModel
    .find({ post_id: `/${postID}/` })
    .sort('-timestamp')
    .exec();

  console.log(postReplies);

  return postReplies;
}

async function getPostReplybyID(postReplyID: string) {
  const postReplies = postReplyModel.findById(postReplyID);
  if (!postReplies) {
    throw new AppError(`unable to find post reply for id ${postReplyID}`, 500);
  }
  console.log(postReplies);

  return postReplies;
}

async function createPostReply(
  author: string,
  content: string,
  postID: string,
) {
  const curtime = Date.now();
  const newPostReply = new postReplyModel({
    author: author,
    reply_content: content,
    timestamp: curtime,
    post_id: postID,
  });

  try {
    newPostReply.save();
  } catch (error) {
    throw new AppError(error, 500);
  }
} // const postExists = await posts.getAnIndividualPost(postID);
// console.log('postExists', postExists);

// if (!postExists) {
//   throw new AppError("Can't reply to a non-existing post", 500);
// }
// console.log('MADE IT HERE', postID, postExists);

// const postReplyExists = await postReplyModel.find({
//   $and: [
//     { author: author },
//     { reply_content: content },
//     { timestamp: curtime },
//   ],
// });

//   console.log('MADE IT HERE', String(new mongoose.Types.ObjectId(postID)));
//   // if (postReplyExists) {
//   //   throw new AppError('Post Reply already exists', 500);
//   // }
//   const newPostReply = await postReplyModel.create(
//     {
//       author: author,
//       reply_content: content,
//       timestamp: curtime,
//       // post_id: postID,
//     },
//     { returning: ['post_replies_id'] },
//   );

//   return JSON.stringify(newPostReply);

//   // author will be req.user.id once auth is done
// }

async function deletePostReply(postReplyID: string, author: string) {
  const query = {
    post_replies_id: postReplyID,
    author: author,
  };
  const postReplies = await postReplyModel.findOne({
    post_replies_id: postReplyID,
    author: author,
  });
  if (!postReplies) {
    throw new AppError(
      'Unable to find a post Reply for the specified parameters',
      500,
    );
  }
  const results = await postReplyModel.deleteOne(query);
  return JSON.stringify(results);
}

async function modifyPostReply(postReplyID: string, content: string) {
  if (!content) {
    throw new AppError('Please provide new content for post', 422);
  }
  const curtime = Date.now();
  let postReplyToModify;
  try {
    postReplyToModify = await postReplyModel
      .updateOne(
        { reply_content: 'Edited: ' + content, timestamp: curtime },
        { where: { post_replies_id: postReplyID } },
      )
      .then(function (result) {
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
