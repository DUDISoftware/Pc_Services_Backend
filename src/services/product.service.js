import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import ProductModel from '~/models/Product.model'
import { deleteImage } from '~/utils/cloudinary.js'

const createProduct = async (reqBody, files) => {
  const newProductData = {
    ...reqBody,
    images: files?.map(file => ({
      url: file.path,
      public_id: file.filename
    })) || []
  }
  const newProduct = new ProductModel(newProductData)
  await newProduct.save()
  return newProduct
}

const updateProduct = async (id, reqBody, files) => {
  const updateData = {
    ...reqBody,
    updatedAt: Date.now()
  }

  if (files && files.length > 0) {
    updateData.images = files.map(file => ({
      url: file.path,
      public_id: file.filename
    }))
  }

  const updated = await ProductModel.findByIdAndUpdate(id, updateData, { new: true })
  if (!updated) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
  return updated
}

const deleteProduct = async (id) => {
  const result = await ProductModel.findByIdAndDelete(id)
  if (!result) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')

  if (result.images && result.images.length > 0) {
    await Promise.all(result.images.map(image => deleteImage(image.public_id)))
  }
  return result
}

// ✅ GET all products (with pagination)
const getAllProducts = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit
  const products = await ProductModel.find()
    .populate('category_id', 'name')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })

  const total = await ProductModel.countDocuments()
  return {
    status: 'success',
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    products
  }
}
const getFeaturedProducts = async (limit = 8) => {
  return await ProductModel.find({ is_featured: true, status: 'available' })
    .limit(limit)
    .sort({ createdAt: -1 });
}
// product.service.js
const getRelatedProducts = async (productId, limit = 4) => {
  // lấy product hiện tại để biết category
  const product = await ProductModel.findById(productId);
  if (!product) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');

  // tìm sản phẩm cùng category, khác id hiện tại
  const related = await ProductModel.find({
    category_id: product.category_id,
    _id: { $ne: productId },
    status: 'available'
  })
    .limit(limit)
    .sort({ createdAt: -1 });

  return related;
};

// ✅ GET product by ID
const getProductById = async (id) => {
  const product = await ProductModel.findById(id).populate('category_id', 'name')
  if (!product) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
  return product
}

// ✅ GET products by Category
const getProductsByCategory = async (categoryId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit
  const products = await ProductModel.find({ category_id: categoryId })
    .populate('category_id', 'name')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })

  const total = await ProductModel.countDocuments({ category_id: categoryId })
  return {
    status: 'success',
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    products
  }
}

export const productService = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getFeaturedProducts,
  getRelatedProducts
};
