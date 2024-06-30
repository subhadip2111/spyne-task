const Discussion = require('../models/Discussion');
const User = require('../models/User');
const { uploadImage } = require('../utils/upload');

// Create Discussion
exports.createDiscussion = async (req, res) => {
  const { text, hashtags } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    const newDiscussion = new Discussion({
      user: req.user.id,
      text,
      hashtags: hashtags.split(',').map(tag => tag.trim()),
      image
    });

    const discussion = await newDiscussion.save();
    res.json(discussion);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update Discussion
exports.updateDiscussion = async (req, res) => {
  const { text, hashtags } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    let discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ msg: 'Discussion not found' });
    }

    if (discussion.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const updatedFields = { text, hashtags: hashtags.split(',').map(tag => tag.trim()), image };

    discussion = await Discussion.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );

    res.json(discussion);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete Discussion
exports.deleteDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ msg: 'Discussion not found' });
    }

    if (discussion.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await discussion.remove();

    res.json({ msg: 'Discussion removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get discussions by hashtag
exports.getDiscussionsByHashtag = async (req, res) => {
  try {
    const discussions = await Discussion.find({
      hashtags: req.params.hashtag
    });

    res.json(discussions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get discussions by text
exports.getDiscussionsByText = async (req, res) => {
  try {
    const discussions = await Discussion.find({
      text: new RegExp(req.params.text, 'i')
    });

    res.json(discussions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Like discussion
exports.likeDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (discussion.likes.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Discussion already liked' });
    }

    discussion.likes.push(req.user.id);
    await discussion.save();

    res.json(discussion.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Unlike discussion
exports.unlikeDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion.likes.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Discussion has not yet been liked' });
    }

    discussion.likes = discussion.likes.filter(
      (like) => like.toString() !== req.user.id
    );

    await discussion.save();

    res.json(discussion.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Increment view count
exports.incrementViewCount = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ msg: 'Discussion not found' });
    }

    discussion.views += 1;
    await discussion.save();

    res.json(discussion);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
