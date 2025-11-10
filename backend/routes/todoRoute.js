// routes/todoRoutes.js
import express from 'express';
import { verifyToken } from '../utils/helpers.js';

import {
  createTodo, getTodos, updateTodo, toggleComplete, deleteTodo
} from '../controllers/todoController.js';

const todorouter = express.Router();

todorouter.use( verifyToken );

todorouter.post('/', createTodo);
todorouter.get('/', getTodos);
todorouter.put('/:id', updateTodo);
todorouter.put('/:id/toggle', toggleComplete);
todorouter.delete('/:id', deleteTodo);

export default todorouter;