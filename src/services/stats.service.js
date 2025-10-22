import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import StatsModel from '~/models/Stats.model'
import { orderService } from './order.service.js'
import { repairService } from './repair.service.js'
import moment from 'moment-timezone'

/**
 * Gets the start and end of a given day in UTC.
 * @param {Date|string} date - The date to get the range for.
 * @returns {{start: Date, end: Date}} Start and end of the day.
 */
const getDayRange = (date) => {
  const start = moment.utc(date).startOf('day').toDate()
  const end = moment.utc(date).endOf('day').toDate()
  return { start, end }
}

/**
 * Creates a new stats record for a specific date.
 * Throws error if stats already exist for the date.
 * @async
 * @param {Date|string} date - The date for which to create stats.
 * @returns {Promise<Object>} The created stats document.
 */
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

/**
 * Retrieves stats for a specific date.
 * Creates stats if not found.
 * @async
 * @param {Date|string} date - The date to retrieve stats for.
 * @param {string} [fields] - Fields to select.
 * @returns {Promise<Object>} Stats object for the date.
 */
const getStatsByDate = async (date, fields = '') => {
  const { start, end } = getDayRange(date)
  const stats = await StatsModel.findOne({
    $or: [
      { createdAt: { $gte: start, $lte: end } },
      { updatedAt: { $gte: start, $lte: end } }
    ]
  }).sort({ createdAt: -1 }).select(fields)

  if (!stats || stats.length === 0) {
    const res = await createStats(date)
    return {
      _id: res._id,
      visits: res.visits,
      total_profit: res.total_profit,
      total_orders: res.total_orders,
      total_repairs: res.total_repairs,
      total_products: res.total_products,
      createdAt: res.createdAt,
      updatedAt: res.updatedAt
    }
  }
  return {
    _id: stats._id,
    visits: stats.visits,
    total_profit: stats.total_profit,
    total_orders: stats.total_orders,
    total_repairs: stats.total_repairs,
    total_products: stats.total_products,
    createdAt: stats.createdAt,
    updatedAt: stats.updatedAt
  }
}

/**
 * Retrieves all stats records matching a filter.
 * Throws error if none found.
 * @async
 * @param {Object} [filter] - MongoDB filter object.
 * @param {string} [fields] - Fields to select.
 * @returns {Promise<Array>} Array of stats objects.
 */
const getAllStats = async (filter = {}, fields = '') => {
  const stats = await StatsModel.find(filter).sort({ createdAt: -1 }).limit(31).select(fields)
  if (!stats || stats.length === 0) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'No stats found')
  }
  return stats.map(stat => ({
    _id: stat._id,
    visits: stat.visits,
    total_profit: stat.total_profit,
    total_orders: stat.total_orders,
    total_repairs: stat.total_repairs,
    total_products: stat.total_products,
    createdAt: stat.createdAt,
    updatedAt: stat.updatedAt
  }))
}

/**
 * Retrieves stats for a specific month and year.
 * Throws error if none found.
 * @async
 * @param {number} month - Month (1-12).
 * @param {number} year - Year (YYYY).
 * @param {string} [fields] - Fields to select.
 * @returns {Promise<Array>} Array of stats objects for the month.
 */
const getStatsByMonth = async (month, year, fields = '') => {
  const start = moment.utc(`${year}-${month}-01`, 'YYYY-MM-DD').startOf('day').toDate()
  const end = moment(start).endOf('month').endOf('day').toDate()
  const stats = await StatsModel.find({
    $or: [
      { createdAt: { $gte: start, $lte: end } },
      { updatedAt: { $gte: start, $lte: end } }
    ]
  }).sort({ createdAt: -1 }).select(fields)
  if (!stats || stats.length === 0) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'No stats found for this month')
  }
  return stats.map(stat => ({
    _id: stat._id,
    visits: stat.visits,
    total_profit: stat.total_profit,
    total_orders: stat.total_orders,
    total_repairs: stat.total_repairs,
    total_products: stat.total_products,
    createdAt: stat.createdAt,
    updatedAt: stat.updatedAt
  }))
}

/**
 * Updates stats for a specific date.
 * Throws error if stats not found.
 * @async
 * @param {Object} reqBody - Fields to update.
 * @param {Date|string} date - Date to update stats for.
 * @returns {Promise<Object>} Updated stats document.
 */
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

/**
 * Retrieves current statistics for orders and repairs for today.
 *
 * - Calculates total profit from completed orders and repairs.
 * - Counts total, completed, and pending orders.
 * - Counts total, completed, and pending repairs.
 * - Calculates total products sold in completed orders.
 *
 * @async
 * @function getCurrentStats
 * @returns {Promise<Object>} An object containing:
 *   - total_profit {number}: Total profit from completed orders and repairs.
 *   - total_orders {number}: Total number of orders today.
 *   - completed_orders {number}: Number of completed orders today.
 *   - pending_orders {number}: Number of pending orders today.
 *   - total_repairs {number}: Total number of repairs (completed + pending).
 *   - completed_repairs {number}: Number of completed repairs today.
 *   - pending_repairs {number}: Number of pending repairs.
 *   - total_products {number}: Total products sold in completed orders.
 */
const getCurrentStats = async () => {
  const today = new Date()
  const orders = await orderService.getAllRequests(1, 1000, {
    updatedAt: { $gte: today.setHours(0, 0, 0, 0), $lte: today.setHours(23, 59, 59, 999) }
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
    total_products: totalProducts
  }
  return payload
}

/**
 * Increments the visit count for stats of a specific date.
 * Throws error if stats not found.
 * @async
 * @param {Date|string} date - Date to count visit for.
 * @returns {Promise<Object>} Updated stats document.
 */
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
