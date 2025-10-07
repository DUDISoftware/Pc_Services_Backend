import mongoose from 'mongoose';

const schemaOptions = {
  timestamps: true,
  collection: 'info',
  toJSON: {
    virtuals: true,
    versionKey: false
  }
}

const InfoSchema = new mongoose.Schema({
  name: { type: String, required: false, trim: true, maxLength: 100 },
  email: { type: String, required: false, unique: true, trim: true, maxLength: 100 },
  phone: { type: String, required: false, trim: true, maxLength: 15 },
  address: { type: String, required: false, trim: true, maxLength: 200 },
  target: { type: String, required: false, trim: true, maxLength: 500 },
  scope: { type: String, required: false, trim: true, maxLength: 500 },
  facebook: { type: String, required: false, trim: true, maxLength: 200 },
  instagram: { type: String, required: false, trim: true, maxLength: 200 },
  youtube: { type: String, required: false, trim: true, maxLength: 200 },
  x: { type: String, required: false, trim: true, maxLength: 200 },
  terms: { type: String, required: false, trim: true, maxLength: 1000 },           // Điều khoản dịch vụ url
  policy: { type: String, required: false, trim: true, maxLength: 1000 },       // Chính sách bảo mật url  
  payment: { type: String, required: false, trim: true, maxLength: 1000 },      // Chính sách thanh toán url
  return: { type: String, required: false, trim: true, maxLength: 1000 },       // Chính sách đổi trả url
  cookies: { type: String, required: false, trim: true, maxLength: 1000 }      // Chính sách cookies url
}, schemaOptions);

const InfoModel = mongoose.model('Info', InfoSchema);

export default InfoModel;