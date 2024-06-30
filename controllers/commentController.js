const Comment = require('../models/Comment');
const Discussion = require('../models/Discussion');

// Create Comment
exports.createComment = async (req, res) => {
  const { text } = req.body;

  try {
    const discussion = await Discussion.findById(req.params.discussionId);

    if (!discussion) {
      return res.status(404).json({ msg: 'Discussion not found' });
    }

    const newComment = new Comment({
      user: req.user.id,
      discussion: req.params.discussionId,
      text
    });

    const comment = await newComment.save();
    discussion.comments.push(comment.id);

    await discussion.save();

    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update Comment
exports.updateComment = async (req, res) => {
  const { text } = req.body;

  try {
    let comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    comment.text = text;
    await comment.save();

    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete Comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await comment.remove();

    const discussion = await Discussion.findById(comment.discussion);
    discussion.comments = discussion.comments.filter(
      (commentId) => commentId.toString() !== req.params.id
    );

    await discussion.save();

    res.json({ msg: 'Comment removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Like comment
exports.likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (comment.likes.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Comment already liked' });
    }

    comment.likes.push(req.user.id);
    await comment.save();

    res.json(comment.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Unlike comment
exports.unlikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment.likes.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Comment has not yet been liked' });
    }

    comment.likes = comment.likes.filter(
      (like) => like.toString() !== req.user.id
    );

    await comment.save();

    res.json(comment.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
