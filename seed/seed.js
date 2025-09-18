import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CategoryModel from '../src/models/Category.model.js';
import ServiceCategoryModel from '../src/models/ServiceCategory.model.js';
import ProductModel from '../src/models/Product.model.js';
import ServiceModel from '../src/models/Service.model.js';
import BannerModel from '../src/models/Banner.model.js';
import UserModel from '../src/models/User.model.js';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

dotenv.config({ path: '.env.example' });

const connectDB = async () => {
  console.log(process.env.MONGODB_URI);
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');
};

const seed = async () => {
  await connectDB();
  // Xoá toàn bộ dữ liệu cũ
  await Promise.all([
    CategoryModel.deleteMany(),
    ServiceCategoryModel.deleteMany(),
    ProductModel.deleteMany(),
    ServiceModel.deleteMany(),
    BannerModel.deleteMany(),
    UserModel.deleteMany(),
  ]);


  // 1. Seed categories
  const categoryDocs = await CategoryModel.insertMany(
    [...Array(10)].map(() => ({
      name: faker.commerce.department(),
      description: faker.commerce.productDescription(),
    }))
  );

  // 2. Seed service categories
  const serviceCategoryDocs = await ServiceCategoryModel.insertMany(
    [...Array(10)].map(() => ({
      name: faker.company.name(),
      description: faker.company.catchPhrase(),
      status: faker.helpers.arrayElement(['active', 'inactive']),
    }))
  );

  // 3. Seed products (cần category_id thật)
  const productDocs = await ProductModel.insertMany(
    [...Array(20)].map(() => ({
      name: faker.commerce.productName(),
      tags: [faker.commerce.productAdjective(), faker.commerce.productMaterial()],
      ports: faker.helpers.arrayElements(['USB-C', 'USB-A', 'HDMI', 'Ethernet', 'Audio Jack'], { min: 1, max: 3 }),
      size: faker.helpers.arrayElement(['Small', 'Medium', 'Large']),
      panel: faker.helpers.arrayElement(['IPS', 'TN', 'VA']),
      resolution: faker.helpers.arrayElement(['1920x1080', '2560x1440', '3840x2160']),
      model: faker.vehicle.model(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      quantity: faker.number.int({ min: 1, max: 100 }),
      category_id: faker.helpers.arrayElement(categoryDocs)._id,
      brand: faker.company.name(),
      images: [{ url: faker.image.url() }],
      status: faker.helpers.arrayElement(['available', 'out_of_stock', 'hidden']),
      is_featured: faker.datatype.boolean()
    }))
  );

  // 4. Seed services (cần serviceCategory_id thật)
  const serviceDocs = await ServiceModel.insertMany(
    [...Array(20)].map(() => ({
      name: faker.company.catchPhrase(),
      description: faker.lorem.paragraph(),
      price: faker.number.int({ min: 50, max: 500 }),
      type: faker.helpers.arrayElement(['home', 'store']),
      estimated_time: `${faker.number.int({ min: 30, max: 120 })} minutes`,
      status: faker.helpers.arrayElement(['active', 'inactive', 'hidden']),
      category: faker.helpers.arrayElement(serviceCategoryDocs)._id,
    }))
  );

  // 5. Seed banners
  const bannerDocs = await BannerModel.insertMany(
    [...Array(10)].map(() => ({
      title: faker.company.catchPhrase(),
      description: faker.lorem.sentence(),
      image: { url: faker.image.url() },
      link: faker.internet.url()
    }))
  );

  // 6. Seed users (mật khẩu sẽ được mã hóa tự động nhờ pre-save hook)
  const salt = await bcrypt.genSalt(10)
  const userDocs = await UserModel.insertMany(
    [...Array(10)].map(() => ({
      username: faker.internet.username(),
      password: bcrypt.hashSync('password123', salt),
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
