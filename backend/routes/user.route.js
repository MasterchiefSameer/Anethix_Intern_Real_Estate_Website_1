import express from 'express';
import { test } from '../controllers/user.controller.js';

const router = express.Router();

// all logic of route are shifted to controller folders.
router.get('/', test);

export default router;