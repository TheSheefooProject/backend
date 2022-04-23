// library for postgres 0.0.0.0:5432
import AppError from '../../interfaces/AppError';
import postModel from '../../../../db/post';

async function getAllPosts() {
  const posts = await postModel.find({}).sort('-date').exec();
  return posts;
}

async function SearchAllPostsbyTitle(titleQuery: string) {
  const posts = await postModel
    .find({ title: `/${titleQuery}/` })
    .sort('-date')
    .exec();
  console.log(posts);
  return posts;
}

async function SearchAllPostsbyHashtag(hashtag: string) {
  const posts = await postModel
    .find({
      $or: [
        { first_hashtag: `/${hashtag}/` },
        { second_hashtag: `/${hashtag}/` },
        { third_hashtag: `/${hashtag}/` },
      ],
    })
    .sort('-date')
    .exec();
  console.log(posts);
  return posts;
}

async function getAnIndividualPost(postID: string) {
  const posts = await postModel.findById(postID);

  console.log(posts);
  return posts;
}

async function getPostsByAnIndividual(userID: string) {
  const posts = await postModel
    .find({ author: `/${userID}/` })
    .sort('-date')
    .exec();

  console.log(posts);
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

  const postExists = await postModel
    .find({
      $and: [
        { author: `/${author}/` },
        { title: `/${title}/` },
        { content: `/${content}/` },
        { first_hashtag: `/${first_hashtag}/` },
        { second_hashtag: `/${second_hashtag}/` },
        { third_hashtag: `/${third_hashtag}/` },
      ],
    })
    .exec();
  console.log(postExists);
  if (postExists.length > 0) {
    throw new AppError('Post already exists', 500);
  }
  console.log('HERE: ', first_hashtag);
  if (imageURL === '') {
    // TODO: change to new post model as per jeesons thing in auth user
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
    console.log('HERE2');

    newPost = await postModel.create(
      {
        author: author,
        title: title,
        content: content,
        time_created: curtime,
        imageURL: imageURL,
        first_hashtag: first_hashtag,
      },
      { returning: ['_id'] },
    );
  }
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
    const query = { _id: postID };
    console.log(postID, ', ', curUser);

    results = await postModel.deleteOne({ _id: postID });
  } catch (error) {
    throw new AppError('Post being deleted doesnt exist', 500);
  } // const query = "DELETE FROM posts where postID=" + postID;
  // const results = await sequelize.query(query);
  // console.log(results);
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
    console.log(`Modifications to ${postID}: `, modifications);

    post = await postModel.findOneAndUpdate(
      { id: postID },
      {
        title: title,
        content: content,
        imageURL: imageURL,
      },
    );
  } catch (error) {
    console.log('error updating post: ' + postID + ', ' + error);
    throw new AppError('unable to update post', 500, error);
  }
  console.log(post.modifiedCount);

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
