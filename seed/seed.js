import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserModel from '../src/models/User.model.js';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

dotenv.config({ path: '.env.example' });

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');
};

const seed = async () => {
  await connectDB();

  await Promise.all([
    UserModel.deleteMany(),
  ]);

  const salt = await bcrypt.genSalt(10);
  const userDocs = await UserModel.insertMany(
    [...Array(10)].map(() => ({
      username: faker.internet.username(),
      password: bcrypt.hashSync('123456', salt),
      role: faker.helpers.arrayElement(['admin', 'staff']),
      status: faker.helpers.arrayElement(['active', 'locked']),
    }))
  );

  console.log('✅ Seed thành công!');
  process.exit(0);
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
