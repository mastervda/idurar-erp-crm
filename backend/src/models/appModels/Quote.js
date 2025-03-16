const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
    unique: true,
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
    required: true,
    autopopulate: true,
  },
  items: [
    {
      itemName: {
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
  currency: {
    type: String,
    default: 'NA',
    uppercase: true,
    required: true,
  },
  feePickup: {
    type: Number,
    required: true,
  },
  feeKapal: {
    type: Number,
    required: true,
  },
  feeDoring: {
    type: Number,
    required: true,
  },
  feeInsurance: {
    type: Number,
    required: true,
  },
  feeAdmin: {
    type: Number,
    required: true,
  },
  feeTotal: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'sent', 'accepted', 'declined', 'cancelled', 'on hold'],
    default: 'draft',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin',
    required: true,
  },
  removedAt: {
    type: Date,
  },
  removedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin',
  },
  pdf: {
    type: String,
  },
  files: [
    {
      id: String,
      name: String,
      path: String,
      description: String,
      isPublic: {
        type: Boolean,
        default: true,
      },
    },
  ],
});

quoteSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Quote', quoteSchema);
