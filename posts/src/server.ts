import morgan from 'morgan';
import config from './config/dbConfig';
import app from './app';
import mongoose from 'mongoose';

// When locally you can see the errors clearly
if (process.env.NODE_ENV === 'DEVELOPMENT') {
  app.use(morgan('dev'));
}

mongoose
  .connect('mongodb://posts-db:27017/post-db')
  .then(() => {
    console.log('Database connection made');

    /**
     * Start Express server.
     */
    app.listen(process.env.NODE_PORT || 3001, () => {
      console.log(
        'App is running at http://localhost:%d in %s mode',
        process.env.NODE_PORT,
        process.env.NODE_ENV,
      );
      console.log('Press CTRL-C to stop\n');
    });
  })
  .catch(e => {
    console.error(
      'Database connection failed, api has failed to start. Error:',
      e,
    );
  });
