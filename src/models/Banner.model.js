import mongoose from 'mongoose'

const schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false
  }
}

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: Object,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, schemaOptions)

const BannerModel = mongoose.model('banners', bannerSchema)

export default BannerModel
