const mongoose = require('mongoose');
const Model = mongoose.model('Company');
const schema = require('./schemaValidate');

const create = async (req, res) => {
  try {
    let body = req.body;

    // Validasi input
    const { error, value } = schema.validate(body);
    if (error) {
      return res.status(400).json({
        success: false,
        result: null,
        message: error.details[0]?.message,
      });
    }

    // Cek duplikasi nama perusahaan
    const existingCompany = await Model.findOne({
      name: value.name,
      removed: false,
    });

    if (existingCompany) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Company with this name already exists',
      });
    }

    // Tambahkan createdBy
    body.createdBy = req.admin._id;

    // Simpan ke database
    const result = await new Model(body).save();

    return res.status(200).json({
      success: true,
      result,
      message: 'Company created successfully',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      result: null,
      message: err.message || 'Internal Server Error',
    });
  }
};

module.exports = create;
