// seed/seed_computer_topic.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import StatsModel from '~/models/Stats.model';

dotenv.config({ path: '.env' });

const connectDB = async () => {
  console.log(process.env.MONGODB_URI);
  await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.DATABASE_NAME });
  console.log('✅ Connected to MongoDB');
};


const seed = async () => {
  await connectDB();

  const startDate = new Date('2025-08-01');
  const endDate = new Date('2025-09-30');
  const statsData = [];

  for (
    let d = new Date(startDate);
    d <= endDate;
    d.setDate(d.getDate() + 1)
  ) {
    const day = new Date(d); // 🔑 clone mỗi ngày tránh lỗi trùng

    statsData.push({
      date: day,
      visits: faker.number.int({ min: 100, max: 1000 }),
      total_profit: faker.number.float({ min: 1000000, max: 5000000, precision: 0.01 }),
      total_orders: faker.number.int({ min: 10, max: 200 }),
      total_repairs: faker.number.int({ min: 1, max: 50 }),
      total_products: faker.number.int({ min: 1, max: 50 }),
      createdAt: day,
      updatedAt: day,
    });
  }

  try {
    const result = await StatsModel.insertMany(statsData, { ordered: false });
    console.log(`✅ Seed completed. Inserted ${result.length} records.`);
  } catch (err) {
    console.error('❌ Some records may have failed to insert (possibly duplicate dates):');
    console.error(err.message);
  } finally {
    process.exit(0);
  }
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
