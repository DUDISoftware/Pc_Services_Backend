import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import DiscountModel from '~/models/Discount.model.js'
import ProductModel from '~/models/Product.model.js'
import mongoose from 'mongoose'

export const updateDiscount = async (productId, reqBody) => {
  try {
    const SaleOf = reqBody.SaleOf ?? reqBody.discount; 
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'productId không hợp lệ')
    }
    const product = await ProductModel.findById(productId)
    if (!product) throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy sản phẩm')
    
    let result
    if (SaleOf !== undefined && SaleOf !== null) {
      if (typeof SaleOf !== 'number' || SaleOf < 0 || SaleOf > 100) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Giá trị SaleOf không hợp lệ')
      }
      result = await DiscountModel.findOneAndUpdate(
        { product_id: productId },
        { SaleOf },
        { upsert: true, new: true }
      ).populate('product_id', 'name slug')
    } else {
      await DiscountModel.findOneAndDelete({ product_id: productId })
      result = null
    }
    return {
      message: SaleOf !== undefined ? 'Cập nhật giảm giá thành công' : 'Xóa giảm giá thành công',
      SaleOf: result
    }
  } catch (error) {
    console.error('❌ Lỗi khi cập nhật giảm giá:', error)
    throw new ApiError(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

export const getDiscountById = async (productId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'productId không hợp lệ')
    }
    const SaleOf = await DiscountModel.findOne({ product_id: productId })
      .populate('product_id', 'name slug')
    if (!SaleOf) {
      return {
        message: 'Không tìm thấy giảm giá cho sản phẩm này',
        SaleOf: null
      }
    }
    return {
      message: 'Lấy giảm giá thành công',
      SaleOf
    }
  } catch (error) {
    console.error('❌ Lỗi khi lấy giảm giá:', error)
    throw new ApiError(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}


export const discountService = {
  updateDiscount,
  getDiscountById
}
