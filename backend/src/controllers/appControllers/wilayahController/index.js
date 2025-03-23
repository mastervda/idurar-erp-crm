const { default: mongoose } = require('mongoose');

const Wilayah = mongoose.model('Wilayah');

// Mendapatkan semua data wilayah
exports.list = async (req, res) => {
  try {
    const wilayahs = await Wilayah.find();
    res.json(wilayahs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mendapatkan satu wilayah berdasarkan ID
exports.getWilayahById = async (req, res) => {
  try {
    const wilayah = await Wilayah.findById(req.params.id);
    if (!wilayah) {
      return res.status(404).json({ message: 'Wilayah tidak ditemukan' });
    }
    res.json(wilayah);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Menambahkan data wilayah baru
exports.createWilayah = async (req, res) => {
  const wilayah = new Wilayah(req.body);
  try {
    const newWilayah = await wilayah.save();
    res.status(201).json(newWilayah);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Memperbarui data wilayah
exports.updateWilayah = async (req, res) => {
  try {
    const updatedWilayah = await Wilayah.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedWilayah) {
      return res.status(404).json({ message: 'Wilayah tidak ditemukan' });
    }
    res.json(updatedWilayah);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Menghapus data wilayah
exports.deleteWilayah = async (req, res) => {
  try {
    const deletedWilayah = await Wilayah.findByIdAndDelete(req.params.id);
    if (!deletedWilayah) {
      return res.status(404).json({ message: 'Wilayah tidak ditemukan' });
    }
    res.json({ message: 'Wilayah berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
