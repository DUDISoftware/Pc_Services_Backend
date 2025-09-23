import mongoose from 'mongoose'

const schemaOptions = {
  timestamps: true,
  collection: 'ratings',
  toJSON: {
    virtuals: true,
    versionKey: false
  }
};

const ratingSchema = new mongoose.Schema(
  {
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: false },
    service_id: { type: mongoose.Schema.Types.ObjectId, ref: 'services', required: false },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: false,
      trim: true,
      maxlength: 1000
    }
  }, schemaOptions );

ratingSchema.index({
  name: 'text',
  score: 'text',
  product_id: 'text',
  service_id: 'text'
});

const RatingModel = mongoose.model('ratings', ratingSchema);
export default RatingModel;