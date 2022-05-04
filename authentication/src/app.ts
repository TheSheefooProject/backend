// Import global middleware
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import path from 'path';
import xss from 'xss-clean';
// Importing routes
import apiV1Router from './api/v1/routes'; //Refer to the index.ts file
dotenv.config();

const app = express();
app.enable('trust proxy');

// Express configuration
app.use(express.json());
app.use(cors());
app.options('*', cors());
app.use(helmet());
app.use(compression());
app.use(xss());

//Exposing public facing assets to users (currently nothing)
app.use(
  express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }),
);

//Below sets up the ApiV1Router
app.use('/v1', apiV1Router);

app.all('*', (req, res) => {
  res.status(404).json({
    type: 'errors',
    message: 'The API endpoint is not valid',
    current: req.protocol + '://' + req.get('host') + req.originalUrl,
  });
});

export default app;
