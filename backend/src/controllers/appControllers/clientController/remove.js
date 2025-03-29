const mongoose = require('mongoose');
const Model = mongoose.model('Client');

const remove = async (req, res) => {
  try {
    // Mencari dan menghapus client dengan mengubah status `removed` menjadi `true`
    const deletedClient = await Model.findOneAndUpdate(
      {
        _id: req.params.id,
        removed: false,
      },
      {
        $set: {
          removed: true,
        },
      },
      { new: true } // Mengembalikan data yang telah diperbarui
    ).exec();

    // Jika client tidak ditemukan, kembalikan response 404
    if (!deletedClient) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Client not found',
      });
    }

    return res.status(200).json({
      success: true,
      result: deletedClient,
      message: 'Client deleted successfully',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      result: null,
      message: err.message || 'Internal Server Error',
    });
  }
};

module.exports = remove;
