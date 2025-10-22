import { StatusCodes } from 'http-status-codes'
import { infoService } from '~/services/info.service.js'

/**
 * Controller: Lấy tất cả thông tin giới thiệu hoặc liên hệ (Info).
 *
 * ✅ Query params:
 * - `fields`: danh sách trường muốn lấy, cách nhau bằng dấu phẩy (ví dụ: `title,description,email`)
 * - `filter`: chuỗi JSON để lọc dữ liệu (ví dụ: `{"type":"contact"}`)
 *
 * ✅ Response:
 * - 200 OK: Trả về danh sách `infos` (mảng các bản ghi)
 *
 * ⚠️ Nếu `filter` không hợp lệ, middleware `next(error)` sẽ được gọi.
 *
 * @param {import('express').Request} req Express Request
 * @param {import('express').Response} res Express Response
 * @param {import('express').NextFunction} next Express Next Function
 * @returns {Promise<void>}
 */
const getAll = async (req, res, next) => {
  try {
    const { fields, filter } = req.query
    const selectedFields = fields ? fields.split(',') : undefined
    const filterObj = filter ? JSON.parse(filter) : undefined

    const infos = await infoService.get(filterObj, selectedFields)
    res.status(StatusCodes.OK).json(infos)
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Tạo mới thông tin (ví dụ: phần giới thiệu, liên hệ, banner phụ, v.v.).
 *
 * ✅ Request body:
 * - Các trường văn bản như `title`, `description`, `email`, v.v.
 *
 * ✅ Request files:
 * - `req.files`: tập tin upload (ảnh, tài liệu đính kèm)
 *
 * ✅ Response:
 * - 201 Created: `{ ...result }` trả về thông tin đã tạo.
 *
 * ⚠️ Nếu upload thất bại hoặc dữ liệu không hợp lệ → ném lỗi qua `next(err)`.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const create = async (req, res, next) => {
  try {
    const result = await infoService.create(req.body, req.files)
    res.status(StatusCodes.CREATED).json(result)
  } catch (err) {
    next(err)
  }
}

/**
 * Controller: Cập nhật thông tin hiện có.
 *
 * ✅ Request body:
 * - Chứa các trường cần cập nhật (ví dụ: `title`, `description`, `phone`, `email`, v.v.)
 *
 * ✅ Request files:
 * - `req.files`: nếu có, chứa các file ảnh hoặc file đính kèm mới.
 *
 * ✅ Response:
 * - 200 OK: `{ ...result }` trả về dữ liệu sau khi cập nhật.
 *
 * ⚠️ Nếu lỗi validation hoặc file upload → ném qua `next(err)`.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const update = async (req, res, next) => {
  try {
    const result = await infoService.update(req.body, req.files)
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

/**
 * Controller: Gửi email từ hệ thống (ví dụ: form liên hệ hoặc phản hồi từ người dùng).
 *
 * ✅ Request body:
 * - `email`: địa chỉ người nhận (bắt buộc)
 * - `subject`: tiêu đề email (bắt buộc)
 * - `message`: nội dung email (bắt buộc)
 *
 * ✅ Response:
 * - 200 OK: `{ message: 'Email sent successfully' }`
 *
 * ⚠️ Nếu lỗi gửi email (SMTP, kết nối, xác thực) → ném qua `next(err)`.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const sendEmail = async (req, res, next) => {
  try {
    const { email, subject, message } = req.body
    await infoService.sendEmail(email, subject, message)
    res.status(StatusCodes.OK).json({ message: 'Email sent successfully' })
  } catch (err) {
    next(err)
  }
}

/**
 * Bộ controller cho module Info.
 *
 * Bao gồm:
 * - `getAll`: lấy danh sách thông tin (giới thiệu, liên hệ, v.v.)
 * - `create`: tạo thông tin mới (có thể bao gồm upload file)
 * - `update`: cập nhật thông tin hiện có
 * - `sendEmail`: gửi email hệ thống
 */
export const infoController = {
  getAll,
  create,
  update,
  sendEmail
}
