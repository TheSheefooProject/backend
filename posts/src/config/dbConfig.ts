import dotenv from 'dotenv';
dotenv.config();

const sqlConfig = {
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'sheefoo-backend',
  server: process.env.DB_SERVER || 'localhost',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: process.env.NODE_ENV !== 'DEVELOPMENT', //todo Check what happens when deployed! change to true for local dev / self-signed certs
  },
};
export default sqlConfig;
