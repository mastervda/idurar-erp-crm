const mongoose = require('mongoose');
const Model = mongoose.model('Client');

const read = async (req, res) => {
  try {
    // Cari dokumen berdasarkan ID dan removed: false
    const result = await Model.findOne({
      _id: req.params.id,
      removed: false,
    })
      .populate('company', 'name shortName') // Tambahkan
      .populate('tags', 'name') // Tambahkan
      .populate('createdBy', 'name')
      .populate('assigned', 'name') // Tambahkan
      .exec();

    // Jika tidak ditemukan, kembalikan response 404
    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No client found',
      });
    }

    // Jika ditemukan, kembalikan response 200 dengan data
    return res.status(200).json({
      success: true,
      result,
      message: 'Client found successfully',
    });
  } catch (err) {
    // Tangani kesalahan server
    return res.status(500).json({
      success: false,
      result: null,
      message: err.message || 'Internal Server Error',
    });
  }
};

module.exports = read;
