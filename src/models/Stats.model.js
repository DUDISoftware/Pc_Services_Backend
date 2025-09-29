import mongoose from 'mongoose';

const schemaOptions = {
  timestamps: true,
  collection: 'stats',
  toJSON: {
    virtuals: true,
    versionKey: false
  }
};

const statsSchema = new mongoose.Schema({
  visits: Number,
  total_profit: Number,
  total_orders: Number,
  total_repairs: Number,
  total_products: Number,
}, schemaOptions);

const StatsModel = mongoose.model('Stats', statsSchema);

export default StatsModel;