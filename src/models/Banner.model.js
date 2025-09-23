import mongoose from 'mongoose'

const schemaOptions = {
  timestamps: true,
  collection: 'banners',
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
  }
}, schemaOptions)

const BannerModel = mongoose.model('banners', bannerSchema)

export default BannerModel
