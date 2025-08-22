import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import ProductModel from '~/models/Product.model'
import { deleteImage } from '~/utils/cloudinary.js'

const createProduct = async (reqBody, files) => {
  const newProductData = {
    ...reqBody,
    images: files.map(file => ({
      url: file.path,
      public_id: file.filename
    }))
  }
  const newProduct = new ProductModel(newProductData)
  await newProduct.save()
  return newProduct
}


// Hàm này chưa làm
const updateProduct = async (id, reqBody, files) => {
  return { 'message': 'Product updated successfully' }
  // eslint-disable-next-line no-unreachable
  const updateData = {
    ...reqBody,
    updated_at: Date.now()
  }

  if (files) {
    updateData.images = files.map(file => ({
      url: file.path,
      public_id: file.filename
    }))
  }
}

const deleteProduct = async (id) => {
  const result = await ProductModel.findByIdAndDelete(id)
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
  }
  // Delete images from cloud storage
  if (result.images && result.images.length > 0) {
    await Promise.all(result.images.map(image => deleteImage(image.public_id)))
  }
  // Return the deleted product data
  return result
}

export const productService = {
  createProduct,
  updateProduct,
  deleteProduct
}