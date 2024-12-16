import express from 'express';
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from '../controllers/todoController.js';

import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getTodos);

router.post('/', createTodo);

router.put('/:todoid', updateTodo);

router.delete('/:todoid', deleteTodo);

export default router;
