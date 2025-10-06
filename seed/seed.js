import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserModel from '../src/models/User.model.js';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

dotenv.config({ path: '.env' });

const connectDB = async () => {
  console.log(process.env.MONGODB_URI);
  await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.DATABASE_NAME });
  console.log('✅ Connected to MongoDB');
};

const seed = async () => {
  await connectDB();

  // await Promise.all([
  //   UserModel.deleteMany(),
  // ]);

  const salt = await bcrypt.genSalt(10);
  const userDocs = await UserModel.insertOne(
    new UserModel({
      username: 'root',
      password: '123456',
      role: 'admin',
      status: 'active',
    })
  );


  console.log('✅ Seed thành công!');
  process.exit(0);
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
