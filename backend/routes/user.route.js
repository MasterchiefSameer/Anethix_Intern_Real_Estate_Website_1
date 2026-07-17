import express from 'express';
import { test, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// all logic of route are shifted to controller folders.
router.get('/', test);
router.post('/update/:id', verifyToken, updateUser);

export default router;