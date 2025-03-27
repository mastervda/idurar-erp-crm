const mongoose = require('mongoose');
const Model = mongoose.model('Company');

const remove = async (req, res) => {
  // Validate request parameters
  const companyId = req.params.id;

  if (!companyId) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'No company ID provided',
    });
  }

  if (!mongoose.Types.ObjectId.isValid(companyId)) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Invalid company ID format',
    });
  }

  try {
    // First check if company exists (regardless of removed status)
    const companyExists = await Model.exists({ _id: companyId });

    if (!companyExists) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Company not found',
      });
    }

    // Check if already removed
    const alreadyRemoved = await Model.findOne({
      _id: companyId,
      removed: true,
    });

    if (alreadyRemoved) {
      return res.status(410).json({
        // 410 Gone status for already deleted resources
        success: false,
        result: null,
        message: 'Company was already deleted',
      });
    }

    // Perform soft delete
    const result = await Model.findByIdAndUpdate(
      companyId,
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
      message: 'Company deleted successfully',
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
