import mongoose from 'mongoose'

const schemaOptions = {
  timestamps: true,
  collection: 'banners',
  toJSON: {
    virtuals: true,
    versionKey: false
  }
}

const bannerSchema = new mongoose.Schema(
  {
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
    position: {
      type: Number,
      default: 0,
      enum: [0, 1, 2, 3, 4] // 0: no use
    },
    layout: {
      type: Number,
      enum: [1, 2, 3], // 1: option1, 2: option2, 3: option3
      required: true
    },
    size: {
      type: String,
      enum: ['large', 'small'], // phân biệt banner lớn/nhỏ
      default: 'large'
    }
  },
  schemaOptions
)

const BannerModel = mongoose.model('banners', bannerSchema)

export default BannerModel