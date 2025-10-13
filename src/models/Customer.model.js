
import mongoose from 'mongoose'

const schemaOptions = {
  timestamps: true,
  collection: 'customers',
  toJSON: {
    virtuals: true,
    versionKey: false
  }
}

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  email: {
    type: String,
    required: false,
    unique: true,
    trim: true,
    maxLength: 100
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxLength: 11
  }
}, schemaOptions)

CustomerSchema.index({ name: 'text', email: 'text', phone: 'text' })

const Customer = mongoose.model('Customer', CustomerSchema)

export default Customer

