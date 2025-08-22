import mongoose from 'mongoose'

const schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false
  }
}

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories',
    required: true
  },
  brand: {
    type: String,
    required: true,
    maxlength: 100
  },
  images: {
    type: [Object],
    default: []
  },
  status: {
    type: String,
    enum: ['available', 'out_of_stock', 'hidden'],
    default: 'available'
  }
}, schemaOptions)


const ProductModel = mongoose.model('products', productSchema)

export default ProductModel