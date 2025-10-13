import mongoose from 'mongoose'

const schemaOptions = {
  timestamps: true,
  collection: 'products',
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
  tags: {
    type: [String],
    default: [],
    trim: true,
    maxlength: 200,
    required: false
  },
  slug:{
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
    unique: true,
    index: true
  },
  ports: {
    type: [String],
    default: [],
    trim: true,
    maxLength: 50,
    required: false
  },
  panel: {
    type: String,
    default: '',
    trim: true,
    maxLength: 100,
    required: false
  },
  resolution: {
    type: String,
    default: '',
    trim: true,
    maxLength: 50,
    required: false
  },
  size: {
    type: String,
    default: '',
    trim: true,
    maxLength: 50,
    required: false
  },
  model: {
    type: String,
    default: '',
    trim: true,
    maxLength: 100,
    required: false
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
  discount: {
      type: Number,
       required: true,
      default: 0,
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
  },
  is_featured: {
    type: Boolean,
    default: false
  }
}, schemaOptions)

productSchema.index({
  name: 'text',
  tags: 'text',
  brand: 'text'
})

const ProductModel = mongoose.model('products', productSchema)

export default ProductModel