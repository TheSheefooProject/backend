// library for postgres 0.0.0.0:5432
import AppError from '../../interfaces/AppError';
import postModel from '../../../../db/post';

async function getAllPosts() {
  const posts = await postModel.find({}).sort('-date').exec();
  return posts;
}

async function SearchAllPostsbyTitle(titleQuery: string) {
  const posts = await postModel
    .find({ title: { $regex: '.*' + titleQuery + '.*' } })
    .sort('-date')
    .exec();

  return posts;
}

async function SearchAllPostsbyHashtag(hashtag: string) {
  const posts = await postModel
    .find({
      $or: [
        { first_hashtag: { $regex: '.*' + hashtag + '.*' } },
        { second_hashtag: { $regex: '.*' + hashtag + '.*' } },
        { third_hashtag: { $regex: '.*' + hashtag + '.*' } },
      ],
    })
    .sort('-date')
    .exec();

  return posts;
}

async function getAnIndividualPost(postID: string) {
  const posts = await postModel.findById(postID);

  return posts;
}

async function getPostsByAnIndividual(userID: string) {
  const posts = await postModel
    .find({ author: { $regex: '.*' + userID + '.*' } })
    .sort('-date')
    .exec();

  return posts;
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

  // const postExists = await postModel
  //   .find({
  //     $and: [
  //       { author: `/${author}/` },
  //       { title: `/${title}/` },
  //       { content: `/${content}/` },
  //       { first_hashtag: `/${first_hashtag}/` },
  //       { second_hashtag: `/${second_hashtag}/` },
  //       { third_hashtag: `/${third_hashtag}/` },
  //     ],
  //   })
  //   .exec();

  // if (postExists.length > 0) {
  //   throw new AppError('Post already exists', 500);
  // }
  
  if (imageURL === '') {
    newPost = await postModel.create(
      {
        author,
        title,
        content,
        curtime,
        first_hashtag,
        second_hashtag,
        third_hashtag,
      },
      { returning: ['_id'] },
    );
  } else {
    newPost = await postModel.create(
      {
        author: author,
        title: title,
        content: content,
        time_created: curtime,
        imageURL: imageURL,
        first_hashtag: first_hashtag,
        second_hashtag: second_hashtag,
        third_hashtag: third_hashtag,
      },
      { returning: ['_id'] },
    );
  }
  return JSON.stringify(newPost);
  // author will be req.user.id once auth is done
};

export const deletePost = async (
  postID: string,
  curUser: string,
): Promise<string> => {
  let results;
  try {
    const query = { _id: postID };

    results = await postModel.deleteOne({ _id: postID });
  } catch (error) {
    throw new AppError('Post being deleted doesnt exist', 500);
  }
  return JSON.stringify(results);
};

export const modifyPost = async (
  postID: string,
  title: string,
  content: string,
  imageURL?: string,
): Promise<string> => {
  let modifications;
  let post;
  try {
    if (imageURL === '') {
      modifications = {
        title: title,
        content: content,
        imageURL: imageURL,
      };
    } else {
      modifications = {
        title: title,
        content: content,
        imageURL: imageURL,
      };
    }

    post = await postModel.findOneAndUpdate(
      { id: postID },
      {
        title: title,
        content: content,
        imageURL: imageURL,
      },
    );
  } catch (error) {
    throw new AppError('unable to update post', 500, error);
  }

  const res = JSON.stringify(post);
  return res;
};

export default {
  getAllPosts,
  getAnIndividualPost,
  SearchAllPostsbyTitle,
  SearchAllPostsbyHashtag,
  getPostsByAnIndividual,
  createPost,
  modifyPost,
  deletePost,
};
