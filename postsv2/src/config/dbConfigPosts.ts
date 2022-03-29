const dbConfigPosts = {
  HOST: '0.0.0.0',
  USER: 'postgres',
  PASSWORD: 'example',
  DB: 'posts',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

export default dbConfigPosts;
