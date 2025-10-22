import { StatusCodes } from 'http-status-codes'
import { bannerService } from '~/services/banner.service.js'

/**
 * Controller: Lấy danh sách tất cả banner (có phân trang tùy chọn).
 *
 * ✅ Query params:
 * - `limit`: số banner tối đa mỗi trang (tùy chọn)
 * - `page`: số trang hiện tại (tùy chọn)
 *
 * ✅ Response:
 * - 200 OK: `{ status: 'success', banners: [...] }`
 *
 * @param {import('express').Request} req Express Request
 * @param {import('express').Response} res Express Response
 * @param {import('express').NextFunction} next Express Next Function
 * @returns {Promise<void>}
 */
const getAllBanners = async (req, res, next) => {
  try {
    const { limit, page } = req.query
    const banners = await bannerService.getAllBanners(limit, page)
    res.status(StatusCodes.OK).json({
      status: 'success',
      banners
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Tạo mới một banner.
 *
 * ✅ Yêu cầu:
 * - `req.file`: file hình ảnh (bắt buộc) — gửi với field name `"image"`.
 * - `req.body`: chứa thông tin bổ sung cho banner (nếu có).
 *
 * ✅ Response:
 * - 201 Created: `{ status: 'success', message: 'Tạo banner thành công', banner }`
 * - 400 Bad Request: nếu không có file ảnh.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const createBanner = async (req, res, next) => {
  try {
    const file = req.file
    if (!file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'Image file is required. Please send the file with field name "image"'
      })
    }

    const banner = await bannerService.createBanner(req.body, file)
    res.status(StatusCodes.CREATED).json({
      status: 'success',
      message: 'Tạo banner thành công',
      banner
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Cập nhật thông tin banner.
 *
 * ✅ Yêu cầu:
 * - `req.params.id`: ID banner cần cập nhật.
 * - `req.file`: ảnh mới (tùy chọn).
 * - `req.body`: dữ liệu cập nhật khác (nếu có).
 *
 * ✅ Response:
 * - 200 OK: `{ status: 'success', message: 'Cập nhật banner thành công', banner: updatedBanner }`
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const updateBanner = async (req, res, next) => {
  try {
    const { id } = req.params
    const file = req.file
    const updatedBanner = await bannerService.updateBanner(id, req.body, file)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Cập nhật banner thành công',
      banner: updatedBanner
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Xóa một banner theo ID.
 *
 * ✅ Yêu cầu:
 * - `req.params.id`: ID banner cần xóa.
 *
 * ✅ Response:
 * - 200 OK: `{ status: 'success', message: 'Xoá banner thành công' }`
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const deleteBanner = async (req, res, next) => {
  try {
    const { id } = req.params
    await bannerService.deleteBanner(id)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Xoá banner thành công'
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Bộ controller cho module Banner.
 *
 * Bao gồm:
 * - `getAllBanners`: lấy danh sách banner (phân trang)
 * - `createBanner`: tạo banner mới (upload ảnh)
 * - `updateBanner`: cập nhật banner
 * - `deleteBanner`: xóa banner theo ID
 */
export const bannerController = {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner
}
