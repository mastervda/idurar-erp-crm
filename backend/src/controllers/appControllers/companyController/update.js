const mongoose = require('mongoose');
const Model = mongoose.model('Company');
const schema = require('./schemaValidate');

const update = async (req, res) => {
  try {
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        result: null,
        message: error.details[0]?.message,
      });
    }

    // PATCH biasanya hanya mengupdate field yang dikirim
    const result = await Model.findOneAndUpdate(
      { _id: req.params.id },
      { $set: value }, // Gunakan $set untuk partial update
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    return res.status(200).json({
      success: true,
      result,
      message: 'Company updated successfully',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Server error',
    });
  }
};

module.exports = update;
