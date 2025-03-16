const mongoose = require('mongoose');

const wilayahSchema = new mongoose.Schema({
    kode: String,
    nama: String,
    provinsi: String,
    kota: String,
    kecamatan: String,
    kelurahan: String
});

module.exports = mongoose.model('Wilayah', wilayahSchema);
