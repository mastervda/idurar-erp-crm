const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  loadingDate: {
    type: Date,
    required: true,
  },
  operator: {
    type: String,
    required: true,
  },
  admin: {
    type: String,
    required: true,
  },
  serialNumber: {
    type: String,
    required: true,
  },
  picTujuan: {
    type: String,
    required: true,
  },
  items: [
    {
      costProgressId: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
      type: {
        type: String,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  origin: {
    country: { type: String, required: true },
    province: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    village: { type: String, required: true },
    address: { type: String, required: true },
  },
  destination: {
    country: { type: String, required: true },
    province: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    village: { type: String, required: true },
    address: { type: String, required: true },
  },
  picTujuan: {
    type: String,
    required: true,
  },
  picDoring: {
    type: String,
    required: true,
  },
  kapal: {
    type: String,
    required: true,
  },
  asuransi: {
    type: String,
    required: true,
  },
  keterangan: {
    type: String,
    required: true,
  },
  bastUrl: {
    type: String,
    required: true,
  },
  invoiceNumber: {
    type: String,
    required: true,
  },
  invoiceDescription: {
    type: String,
    required: true,
  },
});

shipmentSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Shipment', shipmentSchema);
