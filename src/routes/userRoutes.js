import express from 'express';
import {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  deleteUser,
  getAllUsers
} from '../controllers/userController.js';
import { protect, admin, ownsUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/:id', getUser);
router.put('/:id', protect, admin, ownsUser, updateUser);
router.delete('/:id', protect, admin, ownsUser, deleteUser);

router.get('/', protect, admin, getAllUsers);

export default router;
