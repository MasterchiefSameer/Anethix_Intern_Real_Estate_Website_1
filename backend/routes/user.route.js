import express from 'express';
import { test, updateUser, deleteUser, getUserListings, getUser, toggleFavorite, getFavorites } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// all logic of route are shifted to controller folders.
router.get('/', test);
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/listings/:id', verifyToken, getUserListings);
router.get('/:id', verifyToken, getUser);
router.post('/favorite/:id', verifyToken, toggleFavorite);
router.get('/favorites/:id', verifyToken, getFavorites);

export default router;