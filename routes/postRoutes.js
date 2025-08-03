const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.get('/category/:categoryName', postController.getPostByCategory);
router.get('/slug/:slug', postController.getPostBySlug);

router.post('/', protect, postController.createPost); // Create post
router.put('/:id', protect, postController.updatePost); // Update post
router.delete('/:id', protect, postController.deletePost); // Delete post

module.exports = router;