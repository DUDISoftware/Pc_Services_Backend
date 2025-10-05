import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import StatsModel from '~/models/Stats.model'

function getDayRange(date) {
  const d = new Date(date)
  const start = new Date(d.setHours(0, 0, 0, 0))
  const end = new Date(d.setHours(23, 59, 59, 999))
  return { start, end }
}

const createStats = async (date) => {
  const { start, end } = getDayRange(date)
  const exists = await StatsModel.findOne({
    createdAt: { $gte: start, $lte: end }
  })

  if (exists) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Stats already exists for this date')
  }

  const stats = new StatsModel({
    visits: 0,
    total_profit: 0,
    total_orders: 0,
    total_repairs: 0,
    total_products: 0,
    createdAt: start
  })

  await stats.save()
  return stats
}

const getStats = async (date) => {
  const { start, end } = getDayRange(date)
  const stats = await StatsModel.findOne({
    createdAt: { $gte: start, $lte: end }
  }).sort({ createdAt: -1 })

  if (!stats) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'No stats found for this date')
  }

  return stats
}

const getAll = async () => {
  const stats = await StatsModel.find().sort({ createdAt: -1 }).limit(31)
  if (!stats || stats.length === 0) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'No stats found')
  }
  return stats
}

const getByMonth = async (month, year) => {
  const start = new Date(year, month - 1, 1, 0, 0, 0, 0)
  const end = new Date(year, month, 0, 23, 59, 59, 999)
  const stats = await StatsModel.find({
    createdAt: { $gte: start, $lte: end }
  }).sort({ createdAt: -1 })
  if (!stats || stats.length === 0) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'No stats found for this month')
  }
  return stats
}

const updateStats = async (reqBody, date) => {
  const { start, end } = getDayRange(date)
  const stats = await StatsModel.findOne({
    createdAt: { $gte: start, $lte: end }
  }).sort({ createdAt: -1 })

  if (!stats) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'No stats found to update')
  }

  stats.total_profit = reqBody.total_profit !== undefined
    ? parseFloat(reqBody.total_profit)
    : stats.total_profit
  stats.total_repairs = reqBody.total_repairs !== undefined
    ? parseInt(reqBody.total_repairs)
    : stats.total_repairs
  stats.total_orders = reqBody.total_orders !== undefined
    ? parseInt(reqBody.total_orders)
    : stats.total_orders
  stats.total_products = reqBody.total_products !== undefined
    ? parseInt(reqBody.total_products)
    : stats.total_products

  await stats.save()
  return stats
}

const countVisit = async (date) => {
  const { start, end } = getDayRange(date)
  const stats = await StatsModel.findOne({
    createdAt: { $gte: start, $lte: end }
  }).sort({ createdAt: -1 })

  if (!stats) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'No stats found to count visit')
  }

  stats.visits += 1
  await stats.save()
  return stats
}

export const statsService = {
  createStats,
  getStats,
  getAll,
  getByMonth,
  updateStats,
  countVisit
}
