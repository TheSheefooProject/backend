// library for postgres 0.0.0.0:5432
import AppError from '../../interfaces/AppError';
import postReplyModel from '../../../../db/postReplies';

async function getPostReplies(postID: string) {
  const postReplies = await postReplyModel
    .find({ post_id: { $regex: '.*' + postID + '.*' } })

    .sort('-timestamp')
    .exec();

  return postReplies;
}

async function getPostReplybyID(postReplyID: string) {
  const postReplies = postReplyModel.findById(postReplyID);
  if (!postReplies) {
    throw new AppError(`unable to find post reply for id ${postReplyID}`, 500);
  }

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
  return newPostReply._id;
}

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
  const curtime = Date.now();
  let postReplyToModify;
  try {
    if (!content) {
      throw new AppError('Please provide new content for post', 422);
    }
    postReplyToModify = await postReplyModel.findOneAndUpdate(
      { post_replies_id: { $regex: '.*' + postReplyID + '.*' } },
      { reply_content: 'Edited: ' + content, timestamp: curtime },
      { new: true },
    );
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
