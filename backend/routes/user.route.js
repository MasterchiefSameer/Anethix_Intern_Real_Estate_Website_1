import express from 'express';
import { test, updateUser } from '../controllers/user.controller.js';

const router = express.Router();

// all logic of route are shifted to controller folders.
router.get('/', test);
router.get('/update/:id', updateUser);

export default router;