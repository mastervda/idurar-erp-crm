const mongoose = require('mongoose');
const Model = mongoose.model('Tag');

const remove = async (req, res) => {
  // Validate request parameters
  const tagId = req.params.id;

  if (!tagId) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'No tag ID provided',
    });
  }

  if (!mongoose.Types.ObjectId.isValid(tagId)) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Invalid tag ID format',
    });
  }

  try {
    // First check if tag exists (regardless of removed status)
    const tagExists = await Model.exists({ _id: tagId });

    if (!tagExists) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'tag not found',
      });
    }

    // Check if already removed
    const alreadyRemoved = await Model.findOne({
      _id: tagId,
      removed: true,
    });

    if (alreadyRemoved) {
      return res.status(410).json({
        // 410 Gone status for already deleted resources
        success: false,
        result: null,
        message: 'tag was already deleted',
      });
    }

    // Perform soft delete
    const result = await Model.findByIdAndUpdate(
      tagId,
      {
        $set: {
          removed: true,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      result,
      message: 'tag deleted successfully',
    });
  } catch (err) {
    console.error('Delete error:', err);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Server error during deletion',
      error: err.message,
    });
  }
};

module.exports = remove;
