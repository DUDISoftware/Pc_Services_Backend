/* eslint-disable comma-dangle */
import { StatusCodes } from 'http-status-codes'
import { statsService } from '~/services/stats.service.js'
import ApiError from '~/utils/ApiError.js'

/**
 * Helper: Parse và validate chuỗi ngày từ query/params.
 *
 * ✅ Hợp lệ khi:
 * - `rawDate` tồn tại và `Date.parse(rawDate)` không NaN.
 *
 * ❌ Nếu không hợp lệ:
 * - Ném `ApiError(400, 'Invalid or missing date')`.
 *
 * @param {string | undefined} rawDate Chuỗi ngày cần parse (ISO hoặc chuỗi parse được)
 * @returns {Date} Đối tượng Date hợp lệ
 * @throws {ApiError} Khi date không hợp lệ hoặc thiếu
 */
const parseValidDate = (rawDate) => {
  if (!rawDate || isNaN(Date.parse(rawDate))) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid or missing date')
  }
  return new Date(rawDate)
}

/**
 * Controller: Tạo thống kê cho một ngày cụ thể.
 *
 * ✅ Route: `POST /stats?date=YYYY-MM-DD`
 * ✅ Query:
 * - `date` (bắt buộc): ngày tạo thống kê.
 *
 * ✅ Response:
 * - 201 Created: `{ status: 'success', message, stats }`
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const createStats = async (req, res, next) => {
  try {
    const rawDate = req.query.date
    const date = parseValidDate(rawDate)

    const stats = await statsService.createStats(date)
    res.status(StatusCodes.CREATED).json({
      status: 'success',
      message: 'Tạo thống kê thành công',
      stats,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Lấy tất cả thống kê (tuỳ chọn chọn fields).
 *
 * ✅ Route: `GET /stats`
 * ✅ Query:
 * - `fields`: danh sách trường, phân tách bằng dấu phẩy (vd: `total_orders,total_profit`)
 *
 * ✅ Response:
 * - 200 OK: `{ status: 'success', stats, fields }`
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const getAllStats = async (req, res, next) => {
  try {
    const fields = req.query.fields ? req.query.fields.split(',') : null

    const stats = await statsService.getAllStats(null, fields)
    res.status(StatusCodes.OK).json({ status: 'success', stats, fields })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Lấy thống kê theo tháng/năm.
 *
 * ✅ Route: `GET /stats/month/:month/:year`
 * ✅ Params:
 * - `month`: 1–12
 * - `year`: 4 chữ số (vd: 2025)
 * ✅ Query:
 * - `fields`: danh sách trường (tuỳ chọn)
 *
 * ✅ Response:
 * - 200 OK: `{ status: 'success', stats, fields }`
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const getStatsByMonth = async (req, res, next) => {
  try {
    const { month, year } = req.params
    const fields = req.query.fields ? req.query.fields.split(',') : null

    const stats = await statsService.getStatsByMonth(month, year, fields)
    res.status(StatusCodes.OK).json({ status: 'success', stats, fields })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Lấy thống kê theo ngày cụ thể.
 *
 * ✅ Route: `GET /stats/date/:date`
 * ✅ Params:
 * - `date`: chuỗi ngày (vd: `2025-10-01`)
 * ✅ Query:
 * - `fields`: danh sách trường (tuỳ chọn)
 *
 * ✅ Response:
 * - 200 OK: `{ status: 'success', stats, fields }`
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const getStatsByDate = async (req, res, next) => {
  try {
    const { date } = req.params
    const fields = req.query.fields ? req.query.fields.split(',') : null

    const stats = await statsService.getStatsByDate(date, fields)
    res.status(StatusCodes.OK).json({ status: 'success', stats, fields })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Lấy thống kê hiện tại (theo ngày hôm nay).
 *
 * ✅ Route: `GET /stats/current`
 * ✅ Query:
 * - `fields`: danh sách trường (tuỳ chọn)
 *
 * ✅ Response:
 * - 200 OK: `{ status: 'success', stats, fields }`
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const getCurrentStats = async (req, res, next) => {
  try {
    const fields = req.query.fields ? req.query.fields.split(',') : null
    const today = new Date()

    const stats = await statsService.getCurrentStats({ date: today }, fields)
    res.status(StatusCodes.OK).json({ status: 'success', stats, fields })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Cập nhật thống kê của một ngày.
 *
 * ✅ Route: `PUT /stats?date=YYYY-MM-DD`
 * ✅ Query:
 * - `date` (bắt buộc)
 * ✅ Body:
 * - Các trường thống kê cần cập nhật (vd: `total_profit`, `total_orders`, ...)
 *
 * ✅ Response:
 * - 200 OK: `{ status: 'success', message, stats }`
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const updateStats = async (req, res, next) => {
  try {
    const rawDate = req.query.date
    const date = parseValidDate(rawDate)

    const stats = await statsService.updateStats(req.body, date)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Cập nhật thống kê thành công',
      stats,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Tăng bộ đếm lượt truy cập (visit) của một ngày.
 *
 * ✅ Route: `POST /stats/visit?date=YYYY-MM-DD`
 * ✅ Query:
 * - `date` (bắt buộc)
 *
 * ✅ Response:
 * - 200 OK: `{ status: 'success', stats }`
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const countVisit = async (req, res, next) => {
  try {
    const rawDate = req.query.date
    const date = parseValidDate(rawDate)

    const stats = await statsService.countVisit(date)
    res.status(StatusCodes.OK).json({ status: 'success', stats })
  } catch (error) {
    next(error)
  }
}

/**
 * Bộ controller cho module Stats.
 *
 * Bao gồm:
 * - `createStats`: tạo thống kê cho một ngày
 * - `getAllStats`: lấy tất cả thống kê (tuỳ chọn fields)
 * - `getStatsByMonth`: lấy thống kê theo tháng/năm
 * - `getStatsByDate`: lấy thống kê theo ngày
 * - `getCurrentStats`: lấy thống kê hôm nay
 * - `updateStats`: cập nhật thống kê theo ngày
 * - `countVisit`: tăng lượt truy cập theo ngày
 */
export const statsController = {
  createStats,
  getStatsByDate,
  getAllStats,
  getStatsByMonth,
  updateStats,
  countVisit,
  getCurrentStats,
}
