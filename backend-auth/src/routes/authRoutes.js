import express from 'express';
import { login, register, validateToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/validate', validateToken);

export default router;

