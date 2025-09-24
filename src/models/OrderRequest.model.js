import mongoose from 'mongoose';

const schemaOptions = {
  timestamps: true,
  collection: 'order_requests',
  toJSON: {
    virtuals: true,
    versionKey: false
  }
}

const orderRequestSchema = new mongoose.Schema({
  items: [{
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
    quantity: { type: Number, required: true, min: 1 }
  }],
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: false,
    trim: true,
    maxlength: 100
  },
  note: {
    type: String,
    required: false,
    trim: true,
    maxlength: 500
  },
  address: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  status: {
    type: String,
    enum: ['new', 'in_progress', 'completed', 'cancelled'],
    default: 'new',
    required: false
  },
  hidden: {
    type: Boolean,
    default: false,
    required: false
  }
}, schemaOptions );

orderRequestSchema.index({
  name: 'text',
  phone: 'text',
  email: 'text',
  status: 'text'
});

const OrderRequestModel = mongoose.model('order_requests', orderRequestSchema);
export default OrderRequestModel;