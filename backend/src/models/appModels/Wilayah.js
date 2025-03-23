const mongoose = require('mongoose');

const WilayahSchema = new mongoose.Schema({
  kecamatan: { type: String, required: true },
  kelurahan: { type: String, required: true },
  kode: { type: String, required: true },
  kota: { type: String, required: true },
  nama: { type: String, required: true },
  provinsi: { type: String, required: true },
});

module.exports = mongoose.model('Wilayah', WilayahSchema);
