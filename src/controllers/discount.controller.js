import { StatusCodes } from 'http-status-codes'
import { discountService } from '~/services/discount.service.js'
import mongoose from 'mongoose'

const updateDiscount = async (req, res, next) => {
  try {
    const { productId } = req.params
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'productId không hợp lệ'
      })
    }
    const result = await discountService.updateDiscount(productId, req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}
export const getDiscountById = async (req, res, next) => {
  try {
    const { productId } = req.params
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'productId không hợp lệ'
      })
    }
    const result = await discountService.getDiscountById(productId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}



export const discountController = {
  // getAll,
  // create,
  updateDiscount,
  getDiscountById
}