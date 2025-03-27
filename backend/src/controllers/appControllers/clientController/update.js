const mongoose = require('mongoose');
const Model = mongoose.model('Client');
const CompanyModel = mongoose.model('Company'); // Tambahkan
const TagModel = mongoose.model('Tag'); // Tambahkan
const schema = require('./schemaValidate');

const update = async (req, res) => {
  let body = req.body;

  try {
    // Validasi input dengan schema Joi
    const { error, value } = schema.validate(body);
    if (error) {
      return res.status(400).json({
        success: false,
        result: null,
        message: error.details[0]?.message,
      });
    }

    // Validasi referensi Company
    if (value.company) {
      const companyExists = await CompanyModel.exists({
        _id: value.company,
        removed: false,
      });
      if (!companyExists) {
        return res.status(400).json({
          success: false,
          result: null,
          message: 'Invalid Company reference',
        });
      }
    }

    // Validasi referensi Tags (jika ada)
    if (value.tags && value.tags.length > 0) {
      const validTagsCount = await TagModel.countDocuments({
        _id: { $in: value.tags },
        removed: false,
      });
      if (validTagsCount !== value.tags.length) {
        return res.status(400).json({
          success: false,
          result: null,
          message: 'One or more Tag references are invalid',
        });
      }
    }

    // Cek apakah client ada dan belum dihapus
    const existingClient = await Model.findOne({
      _id: req.params.id,
      removed: false,
    });

    if (!existingClient) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Client not found',
      });
    }

    // Update client dengan data baru
    const result = await Model.findOneAndUpdate(
      { _id: req.params.id, removed: false },
      { ...value, updated: Date.now() }, // Tambahkan timestamp update
      { new: true }
    )
      .populate('company', 'name shortName')
      .populate('tags', 'name')
      .populate('createdBy', 'name')
      .populate('assigned', 'name')
      .exec();

    return res.status(200).json({
      success: true,
      result,
      message: 'Client updated successfully',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      result: null,
      message: err.message || 'Internal Server Error',
    });
  }
};

module.exports = update;
