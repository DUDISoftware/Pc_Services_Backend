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
  name: { type: String, required: true, trim: true, maxLength: 100 },
  email: { type: String, required: true, unique: true, trim: true, maxLength: 100 },
  phone: { type: String, required: true, trim: true, maxLength: 15 },
  address: { type: String, required: true, trim: true, maxLength: 200 },
  target: { type: String, required: true, trim: true, maxLength: 500 },
  scope: { type: String, required: true, trim: true, maxLength: 500 },
  facebook: { type: String, required: false, trim: true, maxLength: 200 },
  instagram: { type: String, required: false, trim: true, maxLength: 200 },
  youtube: { type: String, required: false, trim: true, maxLength: 200 },
  x: { type: String, required: false, trim: true, maxLength: 200 },
  terms: { type: String, required: true, trim: true, maxLength: 1000 },           // Điều khoản dịch vụ url
  policy: { type: String, required: true, trim: true, maxLength: 1000 },       // Chính sách bảo mật url  
}, schemaOptions);

const InfoModel = mongoose.model('Info', InfoSchema);

export default InfoModel;