// Create web server
// 1. Import express
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// 2. Import comments model
const Comment = require('../models/Comment');

// 3. Create routes
// @route   GET api/comments
// @desc    Get all comments
// @access  Public
router.get('/', async (req, res) => {
    try {
        // find all comments
        const comments = await Comment.find();
        res.json(comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/comments
// @desc    Add new comment
// @access  Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('message', 'Message is required').not().isEmpty(),
    check('post_id', 'Post ID is required').not().isEmpty()
], async (req, res) => {
    // check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // return error messages
        return res.status(400).json({ errors: errors.array() });
    }

    // destructure the request
    const { name, email, message, post_id } = req.body;

    try {
        // create a new comment
        const newComment = new Comment({
            name,
            email,
            message,
            post_id
        });

        // save the comment
        const comment = await newComment.save();

        // return the comment
        res.json(comment);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// 4. Export the router
module.exports = router;