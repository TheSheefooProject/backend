const dbConfigPosts = {
  HOST: 'localhost',
  USER: 'postgres',
  PASSWORD: 'password',
  DB: 'posts-db',
  dialect: 'sqlite',
  port: 27018,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

export default dbConfigPosts;
