// src/models/Service.model.js
import mongoose from 'mongoose'

const schemaOptions = {
  timestamps: true,
  collection: 'services',
  toJSON: {
    virtuals: true,
    versionKey: false,
  },
};

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      index: true,
      required: true,
      trim: true,
      maxlength: 200
    },
    slug:{
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      unique: true,
      index: true
    },
    description: {
      type: String,
      index: true,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    discount: {
      type: Number,
       required: true,
      default: 0,
      min: 0
    },
    type: {
      type: String,
      enum: ['at_home', 'at_store'],
      default: 'at_store'
    },
    estimated_time: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'hidden'],
      default: 'active',
    },
    image: {
      type: [String],
      required: false,
      default: []
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'service_categories', // liên kết với bảng service_categories
      required: true,
    },
  }, schemaOptions);

serviceSchema.index({
  name: 'text',
  description: 'text'
});

const ServiceModel = mongoose.model('services', serviceSchema);
export default ServiceModel;
