import mongoose from 'mongoose'

const schemaOptions = {
  timestamps: true,
  collection: 'repair_requests',
  toJSON: {
    virtuals: true,
    versionKey: false,
  },
};

const repairRequestSchema = new mongoose.Schema({
  service_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'services',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  phone: {
    type: String,
    required: true,
    unique: false,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: false,
    unique: false,
    trim: true,
    maxlength: 100
  },
  address: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  repair_type: {
    type: String,
    enum: ['at_home', 'at_store'],
    required: true
  },
  problem_description: {
    type: String,
    required: true,
    maxlength: 500
  },
  estimated_time: {
    type: String,
    required: false,
    maxlength: 100
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
  },
  images: {
    type: [Object],
    default: []
  }
}, schemaOptions );

repairRequestSchema.index({
  name: 'text',
  phone: 'text',
  email: 'text',
  status: 'text'
})

const RepairRequestModel = mongoose.model('repair_requests', repairRequestSchema);
export default RepairRequestModel;