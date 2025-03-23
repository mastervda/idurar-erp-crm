const mongoose = require('mongoose');
const Model = mongoose.model('Shipment');

const paginatedList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.items) || 10;
    const skip = (page - 1) * limit;

    const { sortBy = 'enabled', sortValue = -1, filter, equal, q, fields } = req.query;
    const fieldsArray = fields ? fields.split(',') : [];

    let query = { removed: false };

    // Jika ada parameter pencarian
    if (q && fieldsArray.length > 0) {
      query.$or = fieldsArray.map((field) => ({
        [field]: { $regex: new RegExp(q, 'i') },
      }));
    }

    // Jika ada filter tambahan
    if (filter && equal) {
      query[filter] = equal;
    }

    // Query untuk mendapatkan hasil data dan jumlah total dokumen
    const resultsPromise = Model.find(query)
      .sort({ [sortBy]: sortValue })
      .skip(skip)
      .limit(limit);

    const countPromise = Model.countDocuments(query);

    const [result, count] = await Promise.all([resultsPromise, countPromise]);

    const pages = Math.ceil(count / limit);
    const pagination = { page, pages, count };

    return res.status(200).json({
      success: true,
      result,
      pagination,
      message: 'Successfully found all documents',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Error retrieving data',
      controller: 'paginatedList',
      error: error.message,
    });
  }
};

module.exports = paginatedList;
