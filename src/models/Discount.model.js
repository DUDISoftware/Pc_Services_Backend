import { number } from 'joi'
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
  SaleOf: {
    type: Number,
    required: true,
    trim: true,
    maxlength: 200
  },
 
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
    required: true
  }
 
}, schemaOptions)

discountSchema.index({
  SaleOf: 'Number',
  category_id: 'text'
})

const DiscountModel = mongoose.model('discounts', discountSchema)

export default DiscountModel