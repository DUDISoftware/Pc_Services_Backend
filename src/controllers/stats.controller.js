/* eslint-disable comma-dangle */
import { StatusCodes } from 'http-status-codes'
import { statsService } from '~/services/stats.service.js'
import ApiError from '~/utils/ApiError.js'

const parseValidDate = (rawDate) => {
  if (!rawDate || isNaN(Date.parse(rawDate))) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid or missing date')
  }
  return new Date(rawDate)
}

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

const getAllStats = async (req, res, next) => {
  try {
    const fields = req.query.fields ? req.query.fields.split(',') : null

    const stats = await statsService.getAllStats(null, fields)
    res.status(StatusCodes.OK).json({ status: 'success', stats, fields })
  } catch (error) {
    next(error)
  }
}

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

export const statsController = {
  createStats,
  getStatsByDate,
  getAllStats,
  getStatsByMonth,
  updateStats,
  countVisit,
  getCurrentStats,
}
