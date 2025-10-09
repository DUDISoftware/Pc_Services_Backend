import mongoose from 'mongoose'

const schemaOptions = {
  timestamps: true,
  collection: 'customers',
  toJSON: {
    virtuals: true,
    versionKey: false
  }
}
const customerSchema = new mongoose.Schema({
 name: {
    type: String,
    index: true,
    required: true,
    unique: true,
    trim: true
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
    required: false,
    trim: true,
    maxLength: 15
  }
}, schemaOptions);

const CustomerModel = mongoose.model('customers', customerSchema);

export default CustomerModel;