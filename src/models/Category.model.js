import mongoose from 'mongoose'

const schemaOptions = {
  timestamps: true,
  collection: 'categories',
  toJSON: {
    virtuals: true,
    versionKey: false
  }
}

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    index: true,
    required: true,
    trim: true,
    maxlength: 100
  },
  tags: {
    type: [String],
    default: [],
    index: true,
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
  description: {
    type: String,
    required: true,
    trim: true
  }
}, schemaOptions)

categorySchema.index({
  name: 'text',
  tags: 'text',
  slug: 'text',
});

const CategoryModel = mongoose.model('categories', categorySchema)

export default CategoryModel
