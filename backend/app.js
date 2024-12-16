import express from 'express';
import dotenv from 'dotenv';
import compression from 'compression';
import morgan from 'morgan';
import cors from 'cors';

import { initializeDatabase } from './config/tables.js'
import todoRoutes from './routes/todoRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler } from './utils/errorHandler.js';


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(compression());

// Routes
app.use('/todos', todoRoutes);
app.use('/auth', authRoutes);


// Error handling middleware
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await initializeDatabase();
});
