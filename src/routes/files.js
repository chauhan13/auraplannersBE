const express = require('express');
const contentController = require('../controller/filesController');
const authenticate = require('../middleware/middlewareAuth');

const router = express.Router();

// All content routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/content
 * @desc    Get all content items
 * @access  Private
 */
router.get('/', contentController.getAllContent);

/**
 * @route   GET /api/content/statistics
 * @desc    Get content statistics
 * @access  Private
 */
router.get('/statistics', contentController.getStatistics);

/**
 * @route   GET /api/content/:id
 * @desc    Get content item by ID
 * @access  Private
 */
router.get('/:id', contentController.getContentById);

/**
 * @route   POST /api/content
 * @desc    Create new content item
 * @access  Private
 */
router.post('/', contentController.createContent);

/**
 * @route   PUT /api/content/:id
 * @desc    Update content item
 * @access  Private
 */
router.put('/:id', contentController.updateContent);

/**
 * @route   DELETE /api/content/:id
 * @desc    Delete content item
 * @access  Private
 */
router.delete('/:id', contentController.deleteContent);

module.exports = router;