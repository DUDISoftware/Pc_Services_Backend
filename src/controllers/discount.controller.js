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
    limit = parseInt(limit)
    page = parseInt(page)
    fields = fields.split(',').join(' ')
    const type = req.params.type || 'product'
    const discounts = await discountService.getAllDiscounts(type, limit, page, JSON.parse(filter), fields)
    res.status(StatusCodes.OK).json(discounts)
  } catch (error) {
    next(error)
  }
}

const getDiscountById = async (req, res, next) => {
  try {
    const { type, id } = req.params
    const result = await discountService.getDiscountById(type, id)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Lấy thông tin mã giảm giá thành công',
      discount: result
    })
  } catch (error) {
    next(error)
  }
}

const updateDiscount = async (req, res, next) => {
  try {
    const { type, id } = req.params
    const updatedDiscount = await discountService.updateDiscount(type, id, req.body)
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
    const { type, id } = req.params
    await discountService.deleteDiscount(type, id)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Xoá mã giảm giá thành công'
    })
  } catch (error) {
    next(error)
  }
}

const getDiscountforAll = async (req, res, next) => {
  try {
    const { type } = req.params
    const discounts = await discountService.getDiscountforAll(type)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Lấy thông tin mã giảm giá cho tất cả sản phẩm/dịch vụ thành công',
      discounts
    })
  } catch (error) {
    next(error)
  }
}

const updateDiscountforAll = async (req, res, next) => {
  try {
    const { type } = req.params
    await discountService.updateDiscountforAll(type, req.body)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Cập nhật mã giảm giá cho tất cả sản phẩm/dịch vụ thành công'
    })
  } catch (error) {
    next(error)
  }
}

export const discountController = {
  createDiscount,
  getAllDiscounts,
  getDiscountById,
  updateDiscount,
  deleteDiscount,
  getDiscountforAll,
  updateDiscountforAll
}