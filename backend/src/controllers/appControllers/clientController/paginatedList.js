const mongoose = require('mongoose');
const Model = mongoose.model('Client');

const paginatedList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.items) || 10;
    const skip = (page - 1) * limit;

    const { sortBy = 'name', sortValue = 1, filter, equal } = req.query;

    // Pencarian berdasarkan fields
    const fieldsArray = req.query.fields ? req.query.fields.split(',') : [];
    let fields = fieldsArray.length === 0 ? {} : { $or: [] };

    if (req.query.q) {
      for (const field of fieldsArray) {
        fields.$or.push({ [field]: { $regex: new RegExp(req.query.q, 'i') } });
      }
    }

    // Query database untuk mendapatkan data
    const resultsPromise = Model.find({
      removed: false,
      ...(filter && equal ? { [filter]: equal } : {}),
      ...fields,
    })
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortValue })
      .populate('company', 'name shortName')
      .populate('tags', 'name')
      .populate('createdBy', 'name')
      .populate('assigned', 'name')
      .exec();

    // Hitung total data yang tersedia
    const countPromise = Model.countDocuments({
      removed: false,
      ...(filter && equal ? { [filter]: equal } : {}),
      ...fields,
    });

    // Jalankan kedua query secara bersamaan
    const [result, count] = await Promise.all([resultsPromise, countPromise]);

    // Hitung jumlah halaman
    const pages = Math.ceil(count / limit);
    const pagination = { page, pages, count };

    if (count > 0) {
      return res.status(200).json({
        success: true,
        result,
        pagination,
        message: 'Successfully retrieved clients',
      });
    } else {
      return res.status(204).json({
        success: true,
        result: [],
        pagination,
        message: 'No clients found',
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      result: null,
      message: err.message || 'Internal Server Error',
    });
  }
};

module.exports = paginatedList;
