import { StatusCodes } from 'http-status-codes'
import { productService } from '~/services/product.service'
import { searchService } from '~/services/search.service.js'

const createProduct = async (req, res, next) => {
  try {
    const files = req.files
    if (!files) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'Image files are required. Please send files with field name "images"'
      })
    }
    const product = await productService.createProduct(req.body, files)
    res.status(StatusCodes.CREATED).json({
      status: 'success',
      message: 'Tạo product thành công',
      product
    })
  } catch (error) {
    next(error)
  }
}

const getRelatedProducts = async (req, res, next) => {
  try {
    const { id } = req.params
    const { limit = 4 } = req.query
    const products = await productService.getRelatedProducts(id, Number(limit))
    res.status(StatusCodes.OK).json({ status: 'success', products })
  } catch (error) {
    next(error)
  }
}

const getQuantity = async (req, res, next) => {
  try {
    const { id } = req.params
    const quantity = await productService.getQuantity(id)
    res.status(StatusCodes.OK).json({ status: 'success', quantity: quantity })
  } catch (error) {
    next(error)
  }
}

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params
    const files = req.files
    const updatedProduct = await productService.updateProduct(id, req.body, files)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Cập nhật product thành công',
      product: updatedProduct
    })
  } catch (error) {
    next(error)
  }
}

const updateQuantity = async (req, res, next) => {
  try {
    const { id } = req.params
    const { quantity } = req.body
    const updatedProduct = await productService.updateQuantity(id, quantity)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Cập nhật số lượng product thành công',
      product: updatedProduct
    })
  } catch (error) {
    next(error)
  }
}

const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const updatedProduct = await productService.updateStatus(id, status)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Cập nhật trạng thái product thành công',
      product: updatedProduct
    })
  } catch (error) {
    next(error)
  }
}

const getFeaturedProducts = async (req, res, next) => {
  try {
    const { limit = 8 } = req.query
    const products = await productService.getFeaturedProducts(Number(limit))
    res.status(StatusCodes.OK).json({ status: 'success', products })
  } catch (error) {
    next(error)
  }
}

const getAllProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const data = await productService.getAllProducts(Number(page), Number(limit))
    res.status(StatusCodes.OK).json(data)
  } catch (error) {
    next(error)
  }
}

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params
    const product = await productService.getProductById(id)
    res.status(StatusCodes.OK).json({ status: 'success', product })
  } catch (error) {
    next(error)
  }
}

const getProductsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params
    const { page = 1, limit = 10 } = req.query
    const data = await productService.getProductsByCategory(categoryId, Number(page), Number(limit))
    res.status(StatusCodes.OK).json(data)
  } catch (error) {
    next(error)
  }
}

const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params
    const product = await productService.getProductBySlug(slug)
    res.status(StatusCodes.OK).json({ status: 'success', product })
  } catch (error) {
    next(error)
  }
}

const searchProducts = async (req, res, next) => {
  try {
    const { query, page = 1, limit = 10 } = req.query
    if (!query || query.trim() === '') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'fail',
        message: 'Query parameter is required'
      })
    }
    const products = await searchService.searchProducts(query, Number(page), Number(limit))
    res.status(StatusCodes.OK).json({
      status: 'success',
      page: Number(page),
      limit: Number(limit),
      results: products.length,
      products
    })
  } catch (error) {
    next(error)
  }
}

const getProductViews = async (req, res, next) => {
  try {
    const { id } = req.params
    const views = await productService.getProductViews(id)
    res.status(StatusCodes.OK).json({ status: 'success', views })
  } catch (error) {
    next(error)
  }
}

const countViewRedis = async (req, res, next) => {
  try {
    const { id } = req.params
    const views = await productService.countViewRedis(id)
    res.status(StatusCodes.OK).json({ status: 'success', views })
  } catch (error) {
    next(error)
  }
}

// You should implement deleteProduct if you want to export it
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params
    await productService.deleteProduct(id)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Xóa product thành công'
    })
  } catch (error) {
    next(error)
  }
}

export const productController = {
  createProduct,
  updateProduct,
  updateQuantity,
  updateStatus,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getProductBySlug,
  getFeaturedProducts,
  getRelatedProducts,
  getQuantity,
  searchProducts,
  getProductViews,
  countViewRedis
}
