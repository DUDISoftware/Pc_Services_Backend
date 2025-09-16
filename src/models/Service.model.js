// src/models/Service.model.js
import mongoose from 'mongoose'

const schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
  },
};

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    type: { type: String, enum: ['home', 'store'], default: 'store' },
    estimated_time: { type: String, required: true, trim: true, maxlength: 100 },
    status: {
      type: String,
      enum: ['active', 'inactive', 'hidden'],
      default: 'active',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'service_categories', // liên kết với bảng service_categories
      required: true,
    },
  },
  schemaOptions
);

const ServiceModel = mongoose.model('services', serviceSchema);
export default ServiceModel;
