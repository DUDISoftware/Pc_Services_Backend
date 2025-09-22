import mongoose from 'mongoose'

const schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false
  }
}

const serviceCategorySchema = new mongoose.Schema(
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
      trim: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  {
    collection: 'service_categories'
  },
  schemaOptions
)

serviceCategorySchema.index({
  name: 'text',
  description: 'text'
});

const ServiceCategoryModel = mongoose.model(
  'service_categories',
  serviceCategorySchema
)
export default ServiceCategoryModel;
