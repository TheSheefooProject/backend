import morgan from 'morgan';
import sql from 'mssql';
import config from './config/dbConfig';
import app from './app';

// When locally you can see the errors clearly
if (process.env.NODE_ENV === 'DEVELOPMENT') {
  app.use(morgan('dev'));
}

(async function () {
  try {
    await sql.connect(config);
    console.log('Connection to SQL Server was successful');
  } catch (err) {
    console.log('Connection to SQL server failed!', err);
  }
})();

sql.on('error', (err: any) => {
  console.log('Connection to SQL server failed!', err);
});

/**
 * Start Express server.
 */
const server = app.listen(process.env.NODE_PORT || 3000, () => {
  console.log(
    'App is running at http://localhost:%d in %s mode',
    process.env.NODE_PORT,
    process.env.NODE_ENV,
  );
  console.log('Press CTRL-C to stop\n');
});

export default server;
