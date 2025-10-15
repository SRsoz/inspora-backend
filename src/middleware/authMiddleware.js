import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Post from '../models/Post.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, try again later' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Account not found' });
    }

    if (user.blocked) {
      return res.status(403).json({ message: 'Account is blocked' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, sign in to your account' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  } else {
    return res.status(403).json({ message: 'Admin access only' });
  }
};

export const ownsUser = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;

    if (req.user._id.toString() === targetUserId || req.user.role === 'admin') {
      return next();
    } else {
      return res.status(403).json({ message: 'You can only modify your own profile' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error, try again later'});
  }
};

export const ownsPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.userId.toString() === req.user._id.toString() || req.user.role === 'admin') {
      req.post = post;
      next();
    } else {
      return res.status(403).json({ message: 'No authorization to modify this post' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error, try again later' });
  }
};

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};
