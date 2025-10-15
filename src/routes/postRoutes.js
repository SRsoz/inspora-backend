import express from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} from '../controllers/postController.js';
import { protect, ownsPost } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/',getPosts);
router.get('/:id', getPostById);

router.post('/', protect, createPost);
router.put('/:id', protect, ownsPost, updatePost);
router.delete('/:id', protect, ownsPost, deletePost);

export default router;
