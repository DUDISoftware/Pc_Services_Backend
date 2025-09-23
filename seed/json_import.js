import dotenv from 'dotenv';
dotenv.config({ path: '.env.example' });
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// 🔧 adjust with your model
import ProductModel from '../src/models/Product.model.js';

const MONGODB_URI = 'mongodb+srv://root:root@ne.tashnri.mongodb.net/electronicComponent?retryWrites=true&w=majority&appName=electronicComponent';
const DEVICE_FOLDER = './';

const importDevices = async function () {
  console.log('🚀 Starting JSON import...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  const files = fs.readdirSync(DEVICE_FOLDER);

  for (const file of files) {
    const raw = fs.readFileSync(path.join(DEVICE_FOLDER, file));
    const data = JSON.parse(raw);
    await ProductModel.insertMany(data);
    console.log(`✅ Imported ${data.length} items from ${file}`);
  }

  process.exit(0);
}

importDevices().catch(err => {
  console.error(err);
  process.exit(1);
});