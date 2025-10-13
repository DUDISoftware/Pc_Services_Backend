import { StatusCodes } from 'http-status-codes'
import { discountService } from '~/services/discount.service.js'

const createDiscount = async (req, res, next) => {
  try {
    const discount = await discountService.createDiscount(req.body)
    res.status(StatusCodes.CREATED).json({
      status: 'success',
      message: 'Tạo mã giảm giá thành công',
      discount
    })
  } catch (error) {
    next(error)
  }
}

const getAllDiscounts = async (req, res, next) => {
  try {
    let { page = 1, limit = 10, filter = '{}', fields = '' } = req.query
    const discounts = await discountService.getAllDiscounts(page, limit, JSON.parse(filter), fields)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Lấy danh sách mã giảm giá thành công',
      discounts
    })
  } catch (error) {
    next(error)
  }
}
const getDiscountById = async (req, res, next) => {
  try {
    const { id } = req.params
    const discount = await discountService.getDiscountById(id)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Lấy thông tin mã giảm giá thành công',
      discount
    })
  } catch (error) {
    next(error)
  }
}

const updateDiscount = async (req, res, next) => {
  try {
    const { id } = req.params
    const updatedDiscount = await discountService.updateDiscount(id, req.body)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Cập nhật mã giảm giá thành công',
      discount: updatedDiscount
    })
  } catch (error) {
    next(error)
  }
}

const deleteDiscount = async (req, res, next) => {
  try {
    const { id } = req.params
    await discountService.deleteDiscount(id)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Xoá mã giảm giá thành công'
    })
  } catch (error) {
    next(error)
  }
}

export {
  createDiscount,
  getAllDiscounts,
  getDiscountById,
  updateDiscount,
  deleteDiscount
}