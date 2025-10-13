import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import StatsModel from '~/models/Stats.model'
import { orderService } from './order.service.js'
import { repairService } from './repair.service.js'

import moment from 'moment-timezone';

const getDayRange = (date) => {
  const start = moment.utc(date).startOf('day').toDate();
  const end = moment.utc(date).endOf('day').toDate();
  return { start, end };
};


const createStats = async (date) => {
  const { start, end } = getDayRange(date)
  const exists = await StatsModel.findOne({
    $or: [
      { createdAt: { $gte: start, $lte: end } },
      { updatedAt: { $gte: start, $lte: end } }
    ]
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

const getStatsByDate = async (date) => {
  const { start, end } = getDayRange(date)
  const stats = await StatsModel.findOne({
    $or: [
      { createdAt: { $gte: start, $lte: end } },
      { updatedAt: { $gte: start, $lte: end } }
    ]
  }).sort({ createdAt: -1 })

  if (!stats || stats.length === 0) {
    const res = await createStats(date)
    return res.data
  }
  return stats
}

const getAllStats = async (filter = {}) => {
  const stats = await StatsModel.find(filter).sort({ createdAt: -1 }).limit(31)
  if (!stats || stats.length === 0) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'No stats found')
  }
  return stats
}

const getStatsByMonth = async (month, year) => {
  const start = moment.utc(`${year}-${month}-01`, 'YYYY-MM-DD').startOf('day').toDate();
  const end = moment(start).endOf('month').endOf('day').toDate(); // ← auto biết tháng có 31 ngày hay 30
  const stats = await StatsModel.find({
    $or: [
      { createdAt: { $gte: start, $lte: end } },
      { updatedAt: { $gte: start, $lte: end } }
    ]
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

const getCurrentStats = async () => {
  const today = new Date()
  const orders = await orderService.getAllRequests(1, 1000, {
    updatedAt: { $gte: today.setHours(0, 0, 0, 0), $lte: today.setHours(23, 59, 59, 999) },
  })
  const completedOrders = orders.filter(order => order.status === 'completed') || []
  const pendingOrders = orders.filter(order => order.status !== 'completed' && order.hidden === false ) || []

  const totalProducts = completedOrders.reduce((sum, order) => {
    const productsCount = Array.isArray(order.items)
      ? order.items.reduce((count, product) => count + (product.quantity || 1), 0)
      : 0
    return sum + productsCount
  }, 0)

  let totalProfit = completedOrders.reduce((sum, order) => {
    const productsProfit = Array.isArray(order.items)
      ? order.items.reduce((pSum, product) => pSum + ((product.price || 0) * (product.quantity || 1)), 0)
      : 0
    return sum + productsProfit
  }, 0)

  const completedRepairs = await repairService.getAllRequests(1, 1000, {
    updatedAt: { $gte: today.setHours(0, 0, 0, 0), $lte: today.setHours(23, 59, 59, 999) },
    status: 'completed'
  })
  const pendingRepairs = await repairService.getAllRequests(1, 1000, {
    status: { $in: ['new', 'in_progress'] },
    hidden: false
  })

  totalProfit += completedRepairs.reduce((sum, repair) => {
    const servicePrice = repair.service_id && repair.service_id.price ? repair.service_id.price : 0
    return sum + servicePrice
  }, 0)

  const payload = {
    total_profit: parseFloat(totalProfit.toFixed(2)),
    total_orders: orders.length,
    completed_orders: completedOrders.length,
    pending_orders: pendingOrders.length,
    total_repairs: completedRepairs.length + pendingRepairs.length,
    completed_repairs: completedRepairs.length,
    pending_repairs: pendingRepairs.length,
    total_products: totalProducts,
  }
  return payload
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
  getStatsByDate,
  getCurrentStats,
  getAllStats,
  getStatsByMonth,
  updateStats,
  countVisit
}
