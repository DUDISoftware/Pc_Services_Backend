import { StatusCodes } from 'http-status-codes'
import { ratingService } from '~/services/rating.service.js'

/**
 * Controller: Tạo mới đánh giá (Rating) cho sản phẩm hoặc dịch vụ.
 *
 * ✅ Request body:
 * - `product_id` (string, optional): ID sản phẩm được đánh giá.
 * - `service_id` (string, optional): ID dịch vụ được đánh giá.
 * - `name` (string, required): Tên người đánh giá.
 * - `score` (number, 1–5, required): Điểm đánh giá.
 * - `comment` (string, optional): Nội dung bình luận.
 *
 * ⚠️ Yêu cầu ít nhất một trong hai trường `product_id` hoặc `service_id`.
 *
 * ✅ Response:
 * - 201 Created: `{ _id, product_id?, service_id?, name, score, comment, createdAt }`
 *
 * @param {import('express').Request} req Express Request
 * @param {import('express').Response} res Express Response
 * @param {import('express').NextFunction} next Express Next Function
 */
const createRating = async (req, res, next) => {
  try {
    const rating = await ratingService.createRating(req.body)
    res.status(StatusCodes.CREATED).json(rating)
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Lấy danh sách đánh giá theo sản phẩm.
 *
 * ✅ Route: `GET /ratings/product/:id`
 * ✅ Query params:
 * - `fields`: danh sách các trường muốn lấy (ví dụ: `name,score,comment`)
 * - `filter`: chuỗi JSON để lọc (ví dụ: `{"score":5}`)
 *
 * ✅ Response:
 * - 200 OK: Danh sách đánh giá cho sản phẩm.
 *
 * ⚠️ Nếu `filter` không phải JSON hợp lệ → trả về lỗi qua `next(error)`.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const getRatingByProduct = async (req, res, next) => {
  try {
    const { id } = req.params
    const { fields, filter } = req.query
    const selectFields = fields ? fields.split(',') : undefined
    const filterObj = filter ? JSON.parse(filter) : undefined

    const ratings = await ratingService.getRatingsByProductId(id, filterObj, selectFields)
    res.status(StatusCodes.OK).json(ratings)
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Lấy danh sách đánh giá theo dịch vụ.
 *
 * ✅ Route: `GET /ratings/service/:id`
 * ✅ Query params:
 * - `fields`: danh sách các trường muốn lấy (ví dụ: `name,score,comment`)
 * - `filter`: chuỗi JSON để lọc (ví dụ: `{"score":{"$gte":4}}`)
 *
 * ✅ Response:
 * - 200 OK: Danh sách đánh giá cho dịch vụ.
 *
 * ⚠️ Nếu `filter` không phải JSON hợp lệ → trả về lỗi qua `next(error)`.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const getRatingByService = async (req, res, next) => {
  try {
    const { id } = req.params
    const { fields, filter } = req.query
    const selectFields = fields ? fields.split(',') : undefined
    const filterObj = filter ? JSON.parse(filter) : undefined

    const ratings = await ratingService.getRatingsByServiceId(id, filterObj, selectFields)
    res.status(StatusCodes.OK).json(ratings)
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Xoá đánh giá theo ID.
 *
 * ✅ Route: `DELETE /ratings/:id`
 *
 * ✅ Response:
 * - 200 OK: `{ status: 'success', message: 'Xoá đánh giá thành công' }`
 *
 * ⚠️ Nếu ID không tồn tại → ném lỗi qua `next(error)`.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const deleteRating = async (req, res, next) => {
  try {
    const { id } = req.params
    await ratingService.deleteRating(id)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Xoá đánh giá thành công'
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Bộ controller cho module Rating.
 *
 * Bao gồm:
 * - `createRating`: Tạo đánh giá mới cho sản phẩm hoặc dịch vụ.
 * - `getRatingByProduct`: Lấy danh sách đánh giá theo sản phẩm.
 * - `getRatingByService`: Lấy danh sách đánh giá theo dịch vụ.
 * - `deleteRating`: Xoá đánh giá theo ID.
 */
export const ratingController = {
  createRating,
  getRatingByProduct,
  getRatingByService,
  deleteRating
}
