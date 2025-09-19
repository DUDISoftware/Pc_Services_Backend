import mongoose from 'mongoose'

const schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
  },
};

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    email: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 15
    },
    address: {
      type: String,
      required: false,
      trim: true,
      maxlength: 200
    },
    map_link: {
      type: String,
      required: true,
      trim: true
    },
  },
  {
    collection: 'contacts',
  },
  schemaOptions
);

const ContactModel = mongoose.model('contacts', contactSchema);
export default ContactModel;