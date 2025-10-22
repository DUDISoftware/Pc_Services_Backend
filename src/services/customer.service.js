import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import CustomerModel from '~/models/Customer.model'

/**
 * Creates a new customer in the database.
 *
 * @param {Object} reqBody - The customer data to create.
 * @returns {Promise<Object>} The created customer object.
 * @throws {ApiError} If an error occurs during creation.
 */
const createCustomer = async (reqBody) => {
  try {
    const customer = await CustomerModel.create(reqBody)
    return customer
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

/**
 * Retrieves a paginated list of customers from the database with optional filtering and field selection.
 *
 * @param {number} [page=1] - The page number for pagination.
 * @param {number} [limit=10] - The number of customers to retrieve per page.
 * @param {Object} [filter={}] - MongoDB filter object to filter customers.
 * @param {string} [field=''] - Space-separated list of fields to include in the result.
 * @returns {Promise<Object>} An object containing pagination info and the list of customers:
 *   {
 *     page: number,
 *     limit: number,
 *     total: number,
 *     totalPages: number,
 *     customers: Array
 *   }
 * @throws {ApiError} If an error occurs during database operations.
 */
const getAllCustomers = async (page = 1, limit = 10, filter = {}, field = '') => {
  try {
    page = Number(page) || 1
    limit = Number(limit) || 10
    const skip = (page - 1) * limit
    const [customers, total] = await Promise.all([
      CustomerModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select(field || undefined),
      CustomerModel.countDocuments(filter)
    ])
    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      customers
    }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

/**
 * Retrieves a customer by their ID with optional field selection.
 *
 * @param {string} id - The ID of the customer to retrieve.
 * @param {string} [field=''] - Space-separated list of fields to include in the result.
 * @returns {Promise<Object>} The customer object.
 * @throws {ApiError} If the customer is not found or a database error occurs.
 */
const getCustomerById = async (id, field = '') => {
  try {
    const customer = await CustomerModel.findById(id).select(field || undefined)
    if (!customer) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Customer not found')
    }
    return customer
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

/**
 * Updates a customer's information by their ID.
 *
 * @param {string} id - The ID of the customer to update.
 * @param {Object} reqBody - The updated customer data.
 * @returns {Promise<Object>} The updated customer object.
 * @throws {ApiError} If the customer is not found or a database error occurs.
 */
const updateCustomer = async (id, reqBody) => {
  try {
    const customer = await CustomerModel.findByIdAndUpdate(id, reqBody, { new: true })
    if (!customer) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Customer not found')
    }
    return customer
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

/**
 * Deletes a customer from the database by their ID.
 *
 * @param {string} id - The ID of the customer to delete.
 * @returns {Promise<Object>} The deleted customer object.
 * @throws {ApiError} If the customer is not found or a database error occurs.
 */
const deleteCustomer = async (id) => {
  try {
    const customer = await CustomerModel.findByIdAndDelete(id)
    if (!customer) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Customer not found')
    }
    return customer
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

export const customerService = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
}
