// seed/seed_computer_topic.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';

import CategoryModel from '../src/models/Category.model.js';
import ServiceCategoryModel from '../src/models/ServiceCategory.model.js';
import ProductModel from '../src/models/Product.model.js';
import ServiceModel from '../src/models/Service.model.js';
import UserModel from '../src/models/User.model.js';
import OrderRequestModel from '../src/models/OrderRequest.model.js';
import RepairRequestModel from '../src/models/RepairRequest.model.js';
import RatingModel from '../src/models/Rating.model.js';
import BannerModel from '../src/models/Banner.model.js';

dotenv.config({ path: '.env.example' });

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');
};

const seed = async () => {
  await connectDB();

  await Promise.all([
    CategoryModel.deleteMany(),
    ServiceCategoryModel.deleteMany(),
    ProductModel.deleteMany(),
    ServiceModel.deleteMany(),
    UserModel.deleteMany(),
    OrderRequestModel.deleteMany(),
    RepairRequestModel.deleteMany(),
    RatingModel.deleteMany(),
    BannerModel.deleteMany(),
  ]);

  console.log('🧹 Cleared old data');

  // Step 1: Seed categories
  const categoryDocs = await CategoryModel.insertMany([
    { name: 'PC', tags: ['computer', 'gaming'], description: 'Personal Computers for work and gaming', slug: 'pc' },
    { name: 'Laptop', tags: ['computer', 'portable'], description: 'Laptops for all purposes', slug: 'laptop' },
    { name: 'Monitor', tags: ['computer', 'display'], description: 'High-resolution displays', slug: 'monitor' },
    { name: 'RAM', tags: ['computer', 'memory'], description: 'Memory modules for systems', slug: 'ram' },
    { name: 'SSD', tags: ['computer', 'storage'], description: 'Solid State Drives for storage', slug: 'ssd' },
    { name: 'HDD', tags: ['computer', 'storage'], description: 'Hard Disk Drives for storage', slug: 'hdd' },
    { name: 'Motherboard', tags: ['computer', 'hardware'], description: 'Main circuit boards', slug: 'motherboard' },
    { name: 'CPU', tags: ['computer', 'hardware'], description: 'Central Processing Units', slug: 'cpu' },
    { name: 'GPU', tags: ['computer', 'hardware'], description: 'Graphics Processing Units', slug: 'gpu' },
    { name: 'Power Supply', tags: ['computer', 'hardware'], description: 'Power supply units', slug: 'power-supply' },
    { name: 'Cooling', tags: ['computer', 'hardware'], description: 'Cooling solutions for PCs', slug: 'cooling' },
    { name: 'Accessories', tags: ['computer', 'hardware'], description: 'PC accessories and peripherals', slug: 'accessories' },
  ]);

  // Step 2: Seed service categories
  const serviceCategoryDocs = await ServiceCategoryModel.insertMany([
    { name: 'Repair Services', description: 'Hardware and software repair', status: 'active', slug: 'repair-services' },
    { name: 'Cleaning Services', description: 'PC and Laptop cleaning', status: 'active', slug: 'cleaning-services' },
  ]);

  // Step 3: Seed products
  const productDocs = await ProductModel.insertMany([
    ...[...Array(5)].map(() => ({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      slug: faker.helpers.slugify(faker.commerce.productName()).toLowerCase(),
      price: faker.number.int({ min: 2000000, max: 20000000 }),
      quantity: faker.number.int({ min: 1, max: 50 }),
      brand: faker.company.name(),
      category_id: categoryDocs[0]._id,
      images: [{ url: faker.image.url() }],
      tags: ['PC', 'Gaming', 'Intel'],
      ports: ['USB-C', 'HDMI'],
      panel: 'Glass',
      resolution: '1920x1080',
      size: 'ATX',
      model: faker.vehicle.model(),
      status: 'available',
      is_featured: true
    })),
    ...[...Array(5)].map(() => ({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      slug: faker.helpers.slugify(faker.commerce.productName()).toLowerCase(),
      price: faker.number.int({ min: 8000000, max: 25000000 }),
      quantity: faker.number.int({ min: 1, max: 30 }),
      brand: faker.company.name(),
      category_id: categoryDocs[1]._id,
      images: [{ url: faker.image.url() }],
      tags: ['Laptop', 'Portable'],
      model: faker.vehicle.model(),
      status: 'available',
      is_featured: false
    })),
  ]);

  // Step 4: Seed services
  const serviceDocs = await ServiceModel.insertMany([
    {
      name: 'Laptop OS Reinstallation',
      description: 'Reinstall Windows/Linux with drivers',
      slug: 'laptop-os-reinstallation',
      price: 300000,
      estimated_time: '90 minutes',
      category_id: serviceCategoryDocs[0]._id,
      type: 'store',
      status: 'active',
      image: [faker.image.url()]
    },
    {
      name: 'PC Cleaning & Thermal Paste',
      description: 'Deep cleaning for PCs, includes new thermal paste',
      slug: 'pc-cleaning-thermal-paste',
      price: 200000,
      estimated_time: '60 minutes',
      category_id: serviceCategoryDocs[1]._id,
      type: 'store',
      status: 'active',
      image: [faker.image.url()]
    }
  ]);

  // Step 5: Seed users
  const userDocs = await UserModel.insertMany([
    ...[...Array(5)].map(() => ({
      username: faker.internet.username(),
      password: 'password123',
      role: 'staff',
      status: 'active'
    }))
  ]);

  // Step 6: Seed order requests
  await OrderRequestModel.insertMany([
    ...[...Array(5)].map(() => ({
      items: [
        {
          product_id: faker.helpers.arrayElement(productDocs)._id,
          quantity: faker.number.int({ min: 1, max: 3 })
        }
      ],
      name: faker.person.fullName(),
      phone: faker.phone.number('09########'),
      email: faker.internet.email(),
      status: 'new',
      note: 'Urgent delivery',
      hidden: false
    }))
  ]);

  // Step 7: Seed repair requests
  await RepairRequestModel.insertMany([
    ...[...Array(5)].map(() => ({
      service_id: faker.helpers.arrayElement(serviceDocs)._id,
      name: faker.person.fullName(),
      phone: faker.phone.number('09########'),
      email: faker.internet.email(),
      address: faker.location.streetAddress(),
      repair_type: 'at_store',
      problem_description: faker.lorem.sentences(2),
      note: 'Please finish today',
      status: 'new',
      hidden: false
    }))
  ]);

  // Step 8: Seed ratings
  await RatingModel.insertMany([
    ...[...Array(5)].map(() => ({
      name: faker.person.firstName(),
      score: faker.number.int({ min: 3, max: 5 }),
      comment: faker.lorem.sentence(),
      product_id: faker.helpers.arrayElement(productDocs)._id,
      service_id: faker.helpers.arrayElement(serviceDocs)._id
    }))
  ]);

  // Step 9: Seed banners
  await BannerModel.insertMany([
    ...[...Array(3)].map(() => ({
      title: faker.company.catchPhrase(),
      description: faker.lorem.sentence(),
      image: { url: faker.image.url() },
      link: faker.internet.url()
    }))
  ]);

  console.log('✅ Seed completed for topic: Computer & Related');
  process.exit(0);
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
