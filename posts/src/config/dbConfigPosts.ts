const dbConfigPosts = {
  HOST: 'localhost',
  USER: 'postgres',
  PASSWORD: 'password',
  DB: 'posts-db',
  dialect: 'postgres',
  port: 5432,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

export default dbConfigPosts;
