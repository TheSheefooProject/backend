const dbConfigPosts = {
  HOST: 'localhost',
  USER: 'postgres',
  PASSWORD: 'example',
  DB: 'posts',
  dialect: 'postgres',
  port: 8080,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

export default dbConfigPosts;
