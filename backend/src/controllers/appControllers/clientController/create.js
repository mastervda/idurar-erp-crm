const mongoose = require('mongoose');
const Model = mongoose.model('Client');
const CompanyModel = mongoose.model('Company');
const TagModel = mongoose.model('Tag');
const schema = require('./schemaValidate');

const create = async (req, res) => {
  try {
    let body = req.body;

    // Validasi input dengan schema
    const { error, value } = schema.validate(body);
    if (error) {
      return res.status(400).json({
        success: false,
        result: null,
        message: error.details[0]?.message,
      });
    }

    const companyData = await CompanyModel.findOne({
      _id: value.company,
      removed: false,
    }).select('_id name shortName');

    if (!companyData) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Invalid Company reference',
      });
    }

    // Ambil data lengkap dari `tags`
    let tagsData = [];
    if (value.tags && value.tags.length > 0) {
      tagsData = await TagModel.find({
        _id: { $in: value.tags },
        removed: false,
      }).select('_id name');
    }

    // Cek duplikasi Client (nama + company)
    const existingClient = await Model.findOne({
      name: value.name,
      'company._id': companyData._id,
      removed: false,
    });
    if (existingClient) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Client with this name and company already exists',
      });
    }

    // Simpan data dengan objek lengkap
    const clientData = {
      ...value,
      company: companyData, // Simpan seluruh objek Company
      tags: tagsData, // Simpan seluruh objek Tags
      createdBy: req.admin._id,
      updated: Date.now(),
    };

    const result = await new Model(clientData).save();

    return res.status(200).json({
      success: true,
      result,
      message: 'Client created successfully',
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
