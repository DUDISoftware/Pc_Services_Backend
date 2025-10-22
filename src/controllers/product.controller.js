import { StatusCodes } from 'http-status-codes'
import { productService } from '~/services/product.service'
import { searchService } from '~/services/search.service.js'

/**
 * Helper: Chuyển chuỗi `fields` từ query sang mảng.
 *
 * @param {string | undefined} fields Chuỗi fields, ví dụ: `"name,price,brand"`
 * @returns {string[] | undefined} Mảng các field hoặc undefined nếu không có.
 */
const parseFields = (fields) => {
  if (!fields) return undefined
  return fields.split(',').map(f => f.trim())
}

/**
 * Controller: Tạo sản phẩm mới (Product).
 *
 * ✅ Request:
 * - `req.body`: chứa thông tin sản phẩm (name, price, category_id, description, v.v.)
 * - `req.files`: danh sách ảnh upload (bắt buộc, field name: `"images"`)
 *
 * ✅ Response:
 * - 201 Created: `{ status, message, product }`
 * - 400 Bad Request: nếu không có ảnh được gửi lên.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
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

/**
 * Controller: Lấy danh sách sản phẩm liên quan theo ID sản phẩm hiện tại.
 *
 * ✅ Route: `GET /products/:id/related`
 * ✅ Query params:
 * - `limit`: số lượng sản phẩm liên quan (mặc định: 4)
 * - `fields`: danh sách trường muốn lấy (tùy chọn)
 *
 * ✅ Response:
 * - 200 OK: `{ status: 'success', products: [...] }`
 */
const getRelatedProducts = async (req, res, next) => {
  try {
    const { id } = req.params
    const { limit = 4, fields } = req.query
    const selectFields = parseFields(fields)
    const products = await productService.getRelatedProducts(id, Number(limit), selectFields)
    res.status(StatusCodes.OK).json({ status: 'success', products })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Lấy số lượng sản phẩm (quantity) theo ID.
 *
 * ✅ Route: `GET /products/:id/quantity`
 * ✅ Query params:
 * - `fields`: các trường cần lấy (tùy chọn)
 *
 * ✅ Response:
 * - 200 OK: `{ status: 'success', quantity }`
 */
const getQuantity = async (req, res, next) => {
  try {
    const { id } = req.params
    const { fields } = req.query
    const selectFields = parseFields(fields)
    const quantity = await productService.getQuantity(id, selectFields)
    res.status(StatusCodes.OK).json({ status: 'success', quantity })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Cập nhật thông tin sản phẩm.
 *
 * ✅ Route: `PUT /products/:id`
 * ✅ Request body: chứa các trường cần cập nhật.
 * ✅ Request files: danh sách ảnh mới (tùy chọn).
 *
 * ✅ Response:
 * - 200 OK: `{ status: 'success', message, product }`
 */
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

/**
 * Controller: Cập nhật số lượng sản phẩm.
 *
 * ✅ Route: `PATCH /products/:id/quantity`
 * ✅ Request body: `{ quantity: number }`
 *
 * ✅ Response:
 * - 200 OK: `{ status, message, product }`
 */
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

/**
 * Controller: Cập nhật trạng thái sản phẩm.
 *
 * ✅ Route: `PATCH /products/:id/status`
 * ✅ Request body: `{ status: 'available' | 'out_of_stock' | 'hidden' }`
 *
 * ✅ Response:
 * - 200 OK: `{ status, message, product }`
 */
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

/**
 * Controller: Lấy danh sách sản phẩm nổi bật (featured).
 *
 * ✅ Route: `GET /products/featured`
 * ✅ Query params:
 * - `limit`: số lượng sản phẩm (mặc định: 8)
 * - `fields`: danh sách trường muốn lấy (tùy chọn)
 *
 * ✅ Response:
 * - 200 OK: `{ status: 'success', products }`
 */
const getFeaturedProducts = async (req, res, next) => {
  try {
    const { limit = 8, fields } = req.query
    const selectFields = parseFields(fields)
    const products = await productService.getFeaturedProducts(Number(limit), selectFields)
    res.status(StatusCodes.OK).json({ status: 'success', products })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Lấy danh sách tất cả sản phẩm (phân trang, lọc, chọn trường).
 *
 * ✅ Route: `GET /products`
 * ✅ Query params:
 * - `page`: số trang (mặc định: 1)
 * - `limit`: số lượng mỗi trang (mặc định: 10)
 * - `fields`: các trường cần lấy (tùy chọn)
 * - `filter`: JSON string (ví dụ: `{"status":"available"}`)
 *
 * ✅ Response:
 * - 200 OK: `{ total, totalPages, products, ... }`
 */
const getAllProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, fields, filter, order } = req.query
    const selectFields = parseFields(fields)
    const filters = filter ? JSON.parse(filter) : undefined
    const sortOrder = order ? JSON.parse(order) : undefined
    const data = await productService.getAllProducts(Number(page), Number(limit), filters, selectFields, sortOrder)
    res.status(StatusCodes.OK).json(data)
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Lấy chi tiết sản phẩm theo ID.
 *
 * ✅ Route: `GET /products/:id`
 * ✅ Query params:
 * - `fields`: các trường muốn lấy (tùy chọn)
 *
 * ✅ Response:
 * - 200 OK: `{ status: 'success', product }`
 */
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params
    const { fields } = req.query
    const selectFields = parseFields(fields)
    const product = await productService.getProductById(id, selectFields)
    res.status(StatusCodes.OK).json({ status: 'success', product })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Lấy danh sách sản phẩm theo danh mục (category).
 *
 * ✅ Route: `GET /products/category/:categoryId`
 * ✅ Query params:
 * - `page`, `limit`, `fields`, `filter`
 *
 * ✅ Response:
 * - 200 OK: `{ total, totalPages, products }`
 */
const getProductsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params
    const { page = 1, limit = 10, fields, filter, order } = req.query
    const selectFields = parseFields(fields)
    const filters = filter ? JSON.parse(filter) : undefined
    const sortOrder = order ? JSON.parse(order) : undefined
    const data = await productService.getProductsByCategory(categoryId, Number(page), Number(limit), filters, selectFields, sortOrder)
    res.status(StatusCodes.OK).json(data)
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Lấy sản phẩm theo slug.
 *
 * ✅ Route: `GET /products/slug/:slug`
 * ✅ Query params:
 * - `fields`: danh sách trường cần lấy (tùy chọn)
 *
 * ✅ Response:
 * - 200 OK: `{ status: 'success', product }`
 */
const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params
    const { fields } = req.query
    const selectFields = parseFields(fields)
    const product = await productService.getProductBySlug(slug, selectFields)
    res.status(StatusCodes.OK).json({ status: 'success', product })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Tìm kiếm sản phẩm theo từ khóa.
 *
 * ✅ Route: `GET /products/search?query=abc`
 * ✅ Query params:
 * - `query`: chuỗi tìm kiếm (bắt buộc)
 * - `page`, `limit`: phân trang (mặc định: 1, 10)
 * - `fields`: danh sách trường cần lấy (tùy chọn)
 * - `filter`: JSON string để lọc (tùy chọn)
 *
 * ✅ Response:
 * - 200 OK: `{ status, page, limit, total, products }`
 * - 400 Bad Request: nếu `query` không hợp lệ hoặc filter sai định dạng.
 */
const searchProducts = async (req, res, next) => {
  try {
    const { query, page = 1, limit = 10, fields = '', filter = {}, order } = req.query
    if (typeof query !== 'string' || query.trim() === '') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'fail',
        message: 'Query parameter is required and must be a string'
      })
    }
    const selectFields = parseFields(fields)
    let filters = {}
    if (filter && Object.keys(filter).length > 0) {
      try {
        filters = JSON.parse(filter)
      } catch (err) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: 'fail',
          message: 'Filter parameter is not valid JSON'
        })
      }
    }
    let orderObj = {}
    if (order && typeof order === 'string') {
      try {
        orderObj = JSON.parse(order)
      } catch (err) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: 'fail',
          message: 'Order parameter is not valid JSON'
        })
      }
    }
    const results = await searchService.searchProducts(query, Number(page), Number(limit), filters, selectFields, orderObj)
    res.status(StatusCodes.OK).json(
      {
        status: 'success',
        page: Number(page),
        limit: Number(limit),
        total: results.total,
        products: results.products
      }
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Lấy tổng số lượt xem sản phẩm (views) từ DB.
 *
 * ✅ Route: `GET /products/:id/views`
 *
 * ✅ Response:
 * - 200 OK: `{ status, views }`
 */
const getProductViews = async (req, res, next) => {
  try {
    const { id } = req.params
    const { fields } = req.query
    const selectFields = parseFields(fields)
    const views = await productService.getProductViews(id, selectFields)
    res.status(StatusCodes.OK).json({ status: 'success', views })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Đếm lượt xem sản phẩm bằng Redis (real-time).
 *
 * ✅ Route: `GET /products/:id/views/redis`
 *
 * ✅ Response:
 * - 200 OK: `{ status, views }`
 */
const countViewRedis = async (req, res, next) => {
  try {
    const { id } = req.params
    const { fields } = req.query
    const selectFields = parseFields(fields)
    const views = await productService.countViewRedis(id, selectFields)
    res.status(StatusCodes.OK).json({ status: 'success', views })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Xóa sản phẩm theo ID.
 *
 * ✅ Route: `DELETE /products/:id`
 *
 * ✅ Response:
 * - 200 OK: `{ status, message: 'Xóa product thành công' }`
 */
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

const exportProductsToExcel = async (req, res, next) => {
  try {
    const buffer = await productService.exportProductsToExcel()

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=products.xlsx'
    )

    res.send(buffer)
  } catch (error) {
    console.error('❌ Lỗi exportProductsToExcel:', error)
    next(error)
  }
}

/**
 * Bộ controller cho module Product.
 *
 * Bao gồm:
 * - CRUD: create, update, delete
 * - getAllProducts, getProductById, getProductBySlug
 * - getProductsByCategory, getRelatedProducts, getFeaturedProducts
 * - updateQuantity, updateStatus, getQuantity
 * - searchProducts, getProductViews, countViewRedis
 */
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
  countViewRedis,
  exportProductsToExcel
}
