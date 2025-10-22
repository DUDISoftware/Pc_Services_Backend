/* eslint-disable no-case-declarations */
/* eslint-disable no-console */
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import DiscountModel from '~/models/Discount.model.js'
import mongoose from 'mongoose'
import CategoryModel from '~/models/Category.model.js'
import ServiceCategoryModel from '~/models/ServiceCategory.model'

/**
 * Updates or deletes the discount for a specific product.
 * If a valid SaleOf value is provided, updates or creates the discount.
 * If SaleOf is not provided, deletes the discount for the product.
 *
 * @param {string} id - The ID of the product to update the discount for.
 * @param {string} type - The type of discount ('product', 'service', 'product_category', 'service_category').
 * @param {Object} reqBody - The request body containing discount information.
 * @param {number} [reqBody.sale_off] - The discount percentage to apply (0-100).
 * @param {number} [reqBody.discount] - Alternative field for discount percentage.
 * @returns {Promise<Object>} An object containing a message and the updated discount information.
 * @throws {ApiError} Throws error if id is invalid, product not found, or SaleOf is invalid.
 */
const updateDiscount = async (type = 'product', id, reqBody) => {
  try {
    // Nếu sale_off không hợp lệ hoặc <= 0 → xóa luôn
    if (reqBody.sale_off !== undefined && reqBody.sale_off <= 0) {
      let deleted
      switch (type) {
      case 'product':
        deleted = await DiscountModel.findOneAndDelete({ product_id: id })
        break
      case 'service':
        deleted = await DiscountModel.findOneAndDelete({ service_id: id })
        break
      case 'product_category':
        deleted = await DiscountModel.findOneAndDelete({ product_category_id: id })
        break
      case 'service_category':
        deleted = await DiscountModel.findOneAndDelete({ service_category_id: id })
        break
      default:
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Loại giảm giá không hợp lệ')
      }

      return {
        message: deleted
          ? `🗑️ Đã xóa giảm giá (sale_off = ${reqBody.sale_off})`
          : 'Không có giảm giá để xóa',
        discount: null
      }
    }

    // Nếu hợp lệ thì cập nhật hoặc tạo mới
    let result
    switch (type) {
    case 'product':
      result = await DiscountModel.findOneAndUpdate(
        { product_id: id },
        { ...reqBody },
        { new: true }
      )
      if (!result) result = await DiscountModel.create({ product_id: id, ...reqBody, type: 'product' })
      break

    case 'service':
      result = await DiscountModel.findOneAndUpdate(
        { service_id: id },
        { ...reqBody },
        { new: true }
      )
      if (!result) result = await DiscountModel.create({ service_id: id, ...reqBody, type: 'service' })
      break

    case 'product_category':
      result = await DiscountModel.findOneAndUpdate(
        { product_category_id: id },
        { ...reqBody },
        { new: true }
      )
      if (!result) result = await DiscountModel.create({ product_category_id: id, ...reqBody, type: 'product_category' })
      break

    case 'service_category':
      result = await DiscountModel.findOneAndUpdate(
        { service_category_id: id },
        { ...reqBody },
        { new: true }
      )
      if (!result) result = await DiscountModel.create({ service_category_id: id, ...reqBody, type: 'service_category' })
      break

    default:
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Loại giảm giá không hợp lệ')
    }

    return {
      message: '✅ Cập nhật giảm giá thành công',
      discount: result
    }
  } catch (error) {
    console.error('❌ Lỗi khi cập nhật giảm giá:', error)
    throw new ApiError(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}


/**
 * Retrieves all discounts based on the specified type and optional filter.
 *
 * @async
 * @function getAllDiscount
 * @param {string} [type='product'] - The type of discount to retrieve. Valid values are 'product', 'service', 'product_category', and 'service_category'.
 * @param {Object} [filter={}] - Optional filter criteria to apply to the query.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of discount documents populated with related fields.
 * @throws {ApiError} Throws an ApiError if the discount type is invalid or if there is a server error.
 */
const getAllDiscounts = async (type = 'product', limit = 10, page = 1, filter = {}) => {
  try {
    const skip = (page - 1) * limit
    let match = {}
    let lookupStage = []
    let sort = { updatedAt: -1 }

    switch (type) {
    case 'product':
      match = { product_id: { $ne: null }, ...filter }

      lookupStage = [
        // Join product info
        {
          $lookup: {
            from: 'products',
            localField: 'product_id',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },

        // Join ratings
        {
          $lookup: {
            from: 'ratings',
            localField: 'product._id',
            foreignField: 'product_id',
            as: 'ratings'
          }
        },
        {
          $addFields: {
            'product.avg_rating': {
              $cond: [
                { $gt: [{ $size: '$ratings' }, 0] },
                { $avg: '$ratings.score' },
                0
              ]
            },
            'product.rating_count': { $size: '$ratings' }
          }
        },

        // Join category discounts
        {
          $lookup: {
            from: 'discounts',
            localField: 'product.category_id',
            foreignField: 'product_category_id',
            as: 'category_discounts'
          }
        },
        {
          $addFields: {
            category_discount: {
              $first: {
                $filter: {
                  input: '$category_discounts',
                  as: 'cd',
                  cond: { $gt: ['$$cd.sale_off', 0] }
                }
              }
            }
          }
        },

        // Ghi đè trực tiếp sale_off, start_date, end_date nếu category tốt hơn
        {
          $addFields: {
            sale_off: {
              $cond: [
                {
                  $or: [
                    { $eq: ['$sale_off', null] },
                    { $lt: ['$sale_off', '$category_discount.sale_off'] }
                  ]
                },
                '$category_discount.sale_off',
                '$sale_off'
              ]
            },
            start_date: {
              $cond: [
                {
                  $or: [
                    { $eq: ['$sale_off', null] },
                    { $lt: ['$sale_off', '$category_discount.sale_off'] }
                  ]
                },
                '$category_discount.start_date',
                '$start_date'
              ]
            },
            end_date: {
              $cond: [
                {
                  $or: [
                    { $eq: ['$sale_off', null] },
                    { $lt: ['$sale_off', '$category_discount.sale_off'] }
                  ]
                },
                '$category_discount.end_date',
                '$end_date'
              ]
            }
          }
        },

        {
          $project: {
            ratings: 0,
            category_discounts: 0,
            category_discount: 0,
            'product.description': 0
          }
        }
      ]
      break

    case 'service':
      match = { service_id: { $ne: null }, ...filter }

      lookupStage = [
        {
          $lookup: {
            from: 'services',
            localField: 'service_id',
            foreignField: '_id',
            as: 'service'
          }
        },
        { $unwind: '$service' },

        {
          $lookup: {
            from: 'discounts',
            localField: 'service.category_id',
            foreignField: 'service_category_id',
            as: 'category_discounts'
          }
        },
        {
          $addFields: {
            category_discount: {
              $first: {
                $filter: {
                  input: '$category_discounts',
                  as: 'cd',
                  cond: { $gt: ['$$cd.sale_off', 0] }
                }
              }
            }
          }
        },
        {
          $addFields: {
            sale_off: {
              $cond: [
                {
                  $or: [
                    { $eq: ['$sale_off', null] },
                    { $lt: ['$sale_off', '$category_discount.sale_off'] }
                  ]
                },
                '$category_discount.sale_off',
                '$sale_off'
              ]
            },
            start_date: {
              $cond: [
                {
                  $or: [
                    { $eq: ['$sale_off', null] },
                    { $lt: ['$sale_off', '$category_discount.sale_off'] }
                  ]
                },
                '$category_discount.start_date',
                '$start_date'
              ]
            },
            end_date: {
              $cond: [
                {
                  $or: [
                    { $eq: ['$sale_off', null] },
                    { $lt: ['$sale_off', '$category_discount.sale_off'] }
                  ]
                },
                '$category_discount.end_date',
                '$end_date'
              ]
            }
          }
        },
        {
          $project: {
            category_discounts: 0,
            category_discount: 0
          }
        }
      ]
      break

    case 'product_category':
      match = { product_category_id: { $ne: null }, ...filter }
      lookupStage = [
        {
          $lookup: {
            from: 'categories',
            localField: 'product_category_id',
            foreignField: '_id',
            as: 'product_category'
          }
        },
        { $unwind: '$product_category' }
      ]
      break

    case 'service_category':
      match = { service_category_id: { $ne: null }, ...filter }
      lookupStage = [
        {
          $lookup: {
            from: 'service_categories',
            localField: 'service_category_id',
            foreignField: '_id',
            as: 'service_category'
          }
        },
        { $unwind: '$service_category' }
      ]
      break

    default:
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Loại giảm giá không hợp lệ')
    }

    // Lọc các bản ghi có giảm giá hợp lệ
    match = { ...match, sale_off: { $gt: 0 } }

    const aggregationPipeline = [
      { $match: match },
      ...lookupStage,
      { $sort: sort },
      { $skip: skip },
      { $limit: limit }
    ]

    const [discounts, total] = await Promise.all([
      DiscountModel.aggregate(aggregationPipeline),
      DiscountModel.countDocuments(match)
    ])

    return {
      status: 'success',
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      discounts
    }
  } catch (error) {
    console.error('❌ Lỗi khi lấy tất cả giảm giá:', error)
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}


/**
 * Retrieves the discount information for a specific product by its ID.
 *
 * @param {string} productId - The ID of the product to get the discount for.
 * @returns {Promise<Object>} An object containing a message and the discount information.
 * @throws {ApiError} Throws error if productId is invalid.
 */
const getDiscountById = async (type = 'product', id) => {
  try {
    switch (type) {
    case 'product':
      return await DiscountModel.findOne({ product_id: id }).populate('product_id', 'name slug images price')
    case 'service':
      return await DiscountModel.findOne({ service_id: id }).populate('service_id', 'name slug images price')
    case 'product_category':
      return await DiscountModel.findOne({ product_category_id: id }).populate('product_category_id', 'name slug')
    case 'service_category':
      return await DiscountModel.findOne({ service_category_id: id }).populate('service_category_id', 'name slug')
    default:
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Loại giảm giá không hợp lệ')
    }
  } catch (error) {
    console.error('❌ Lỗi khi lấy giảm giá:', error)
    throw new ApiError(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

/**
 * Creates a new discount entry in the database.
 *
 * @async
 * @function
 * @param {Object} reqBody - The request body containing discount details.
 * @param {string} [reqBody.product_id] - The ID of the product to apply the discount to.
 * @param {string} [reqBody.service_id] - The ID of the service to apply the discount to.
 * @param {string} [reqBody.product_category_id] - The ID of the product category to apply the discount to.
 * @param {string} [reqBody.service_category_id] - The ID of the service category to apply the discount to.
 * @param {string} reqBody.type - The type of discount.
 * @param {number} reqBody.sale_off - The discount value.
 * @param {Date} reqBody.start_date - The start date of the discount.
 * @param {Date} reqBody.end_date - The end date of the discount.
 * @returns {Promise<Object>} The created discount object with selected fields.
 * @throws {ApiError} If an error occurs during creation.
 */
const createDiscount = async (reqBody) => {
  try {
    const discount = new DiscountModel(reqBody)
    await discount.save()
    return {
      product_id: discount.product_id,
      service_id: discount.service_id,
      product_category_id: discount.product_category_id,
      service_category_id: discount.service_category_id,
      type: discount.type,
      sale_off: discount.sale_off,
      start_date: discount.start_date,
      end_date: discount.end_date
    }
  } catch (error) {
    console.error('❌ Lỗi khi tạo giảm giá:', error)
    throw new ApiError(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

/**
 * Deletes a discount by its ID.
 *
 * @async
 * @function deleteDiscount
 * @param {string} id - The ID of the discount to delete.
 * @returns {Promise<Object>} The deleted discount document.
 * @throws {ApiError} If the ID is invalid, the discount is not found, or a server error occurs.
 */
const deleteDiscount = async (type, id) => {
  try {
    let discount
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'id không hợp lệ')
    }
    switch (type) {
    case 'product':
      discount = await DiscountModel.findOneAndDelete({ product_id: id })
      break
    case 'service':
      discount = await DiscountModel.findOneAndDelete({ service_id: id })
      break
    case 'product_category':
      discount = await DiscountModel.findOneAndDelete({ product_category_id: id })
      break
    case 'service_category':
      discount = await DiscountModel.findOneAndDelete({ service_category_id: id })
      break
    default:
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Loại giảm giá không hợp lệ')
    }
    return discount
  } catch (error) {
    console.error('❌ Lỗi khi xóa giảm giá:', error)
    throw new ApiError(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

const getDiscountforAll = async (type = 'product_category') => {
  try {
    let discounts
    switch (type) {
    case 'product_category':
      discounts = await DiscountModel.find({ product_category_id: { $ne: null } })
      break
    case 'service_category':
      discounts = await DiscountModel.find({ service_category_id: { $ne: null } })
      break
    default:
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Loại giảm giá không hợp lệ')
    }
    return discounts
  } catch (error) {
    console.error('❌ Lỗi khi lấy giảm giá cho tất cả:', error)
    throw new ApiError(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

const updateDiscountforAll = async (type = 'product_category', reqBody) => {
  try {
    const allowedFields = ['sale_off', 'start_date', 'end_date', 'type']
    const updateFields = {}

    for (const key of allowedFields) {
      if (key in reqBody) updateFields[key] = reqBody[key]
    }

    const normalizeDate = (d) => {
      if (!d) return null
      const dateObj = typeof d === 'string' ? new Date(d) : d
      return isNaN(dateObj.getTime()) ? null : dateObj
    }

    if ('start_date' in updateFields) {
      updateFields.start_date = normalizeDate(updateFields.start_date)
    }
    if ('end_date' in updateFields) {
      updateFields.end_date = normalizeDate(updateFields.end_date)
    }

    updateFields.updatedAt = new Date()

    let ids = [], existingDiscounts = [], existingIds = new Set(), categoriesToCreate = []

    switch (type) {
    case 'product_category': {
      const categoryIds = await CategoryModel.find({}, '_id').lean()
      ids = categoryIds.map((cat) => cat._id)

      await DiscountModel.updateMany(
        { product_category_id: { $in: ids } },
        { $set: updateFields }
      )

      // 🧹 Xóa các giảm giá không hợp lệ (sale_off <= 0)
      await DiscountModel.deleteMany({
        product_category_id: { $in: ids },
        sale_off: { $lte: 0 }
      })

      existingDiscounts = await DiscountModel.find(
        { product_category_id: { $in: ids } },
        'product_category_id'
      ).lean()

      existingIds = new Set(existingDiscounts.map((d) => String(d.product_category_id)))
      categoriesToCreate = ids.filter((id) => !existingIds.has(String(id)))

      if (categoriesToCreate.length > 0 && (updateFields.sale_off ?? 0) > 0) {
        const now = new Date()
        const newDiscounts = categoriesToCreate.map((id) => ({
          product_category_id: id,
          sale_off: updateFields.sale_off,
          start_date: updateFields.start_date ?? null,
          end_date: updateFields.end_date ?? null,
          type: 'product_category',
          createdAt: now,
          updatedAt: now
        }))
        await DiscountModel.insertMany(newDiscounts)
      }
      break
    }

    case 'service_category': {
      const serviceCategoryIds = await ServiceCategoryModel.find({}, '_id').lean()
      ids = serviceCategoryIds.map((cat) => cat._id)

      await DiscountModel.updateMany(
        { service_category_id: { $in: ids } },
        { $set: updateFields }
      )

      // 🧹 Xóa giảm giá <= 0
      await DiscountModel.deleteMany({
        service_category_id: { $in: ids },
        sale_off: { $lte: 0 }
      })

      existingDiscounts = await DiscountModel.find(
        { service_category_id: { $in: ids } },
        'service_category_id'
      ).lean()
      existingIds = new Set(existingDiscounts.map((d) => String(d.service_category_id)))
      categoriesToCreate = ids.filter((id) => !existingIds.has(String(id)))

      if (categoriesToCreate.length > 0 && (updateFields.sale_off ?? 0) > 0) {
        const now = new Date()
        const newDiscounts = categoriesToCreate.map((id) => ({
          service_category_id: id,
          sale_off: updateFields.sale_off,
          start_date: updateFields.start_date ?? null,
          end_date: updateFields.end_date ?? null,
          type: 'service_category',
          createdAt: now,
          updatedAt: now
        }))
        await DiscountModel.insertMany(newDiscounts)
      }
      break
    }

    default:
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Loại giảm giá không hợp lệ')
    }

    return {
      message: '✅ Cập nhật giảm giá thành công (đã xóa những discount <= 0)',
      updated: ids.length - categoriesToCreate.length,
      created: categoriesToCreate.length,
      total: ids.length
    }
  } catch (error) {
    console.error('❌ Lỗi khi cập nhật giảm giá:', error)
    throw new ApiError(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}


/**
 * Service object containing discount-related functions.
 */
export const discountService = {
  updateDiscount,
  getDiscountById,
  createDiscount,
  deleteDiscount,
  getAllDiscounts,
  getDiscountforAll,
  updateDiscountforAll
}