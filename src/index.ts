import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import categories from './routes/categories';
import auth from './routes/auth';
import users from './routes/users';
import { logger } from './logger';
import bodyParser from 'body-parser'

dotenv.config();

const app = express();
app.use(bodyParser.json());  
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dishdiscovery';

app.use(express.json());

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });

app.get('/', (req: Request, res: Response) => {
  logger.info('Hello world requested');
  res.send('Hello, World!');
});

app.use('/', categories);
app.use('/', auth);
app.use('/', users);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
