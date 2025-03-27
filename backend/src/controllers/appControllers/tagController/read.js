const mongoose = require('mongoose');
const Model = mongoose.model('Tag');

const read = async (req, res) => {
  try {
    const result = await Model.findOne({
      _id: req.params.id,
      removed: false,
    })
      .populate('createdBy', 'name')
      .exec();

    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Tag not found',
      });
    }

    return res.status(200).json({
      success: true,
      result,
      message: 'Tag found successfully',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      result: null,
      message: err.message || 'Internal Server Error',
    });
  }
};

module.exports = read;
