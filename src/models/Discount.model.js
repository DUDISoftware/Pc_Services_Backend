import mongoose from 'mongoose'

const schemaOptions = {
  timestamps: true,
  collection: 'discounts',
  toJSON: {
    virtuals: true,
    versionKey: false
  }
}

const discountSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
    required: false
  },

  service_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'services',
    required: false
  },

  type: {
    type: String,
    enum: ['product', 'service'],
    required: true,
    trim: true,
    maxlength: 10
  },

  sale_off: {
    type: Number,
    required: true,
    trim: true,
    maxlength: 200
  },

  start_date: {
    type: Date,
    required: true,
    default: Date.now
  },
  end_date: {
    type: Date,
    required: true,
    default: Date.now
  }
}, schemaOptions)

discountSchema.index({
  SaleOf: 'Number',
  category_id: 'text'
})

const DiscountModel = mongoose.model('discounts', discountSchema)

export default DiscountModel