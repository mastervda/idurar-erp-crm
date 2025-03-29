const mongoose = require('mongoose');
const Model = mongoose.model('Tag');

const paginatedList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Base query - always filter out removed tag
    const query = { removed: false };

    // Handle name search
    if (req.query.name) {
      query.name = { $regex: req.query.name, $options: 'i' };
    }

    // Handle shortName search
    if (req.query.shortName) {
      query.shortName = { $regex: req.query.shortName, $options: 'i' };
    }

    // Handle general search (if you want a tag search)
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { shortName: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [results, count] = await Promise.all([
      Model.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      Model.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      result: {
        data: results,
        count,
        page,
        pages: Math.ceil(count / limit),
        limit,
      },
      message: 'Successfully fetched Tag list',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      result: null,
      message: err.message || 'Internal Server Error',
    });
  }
};

module.exports = paginatedList;
