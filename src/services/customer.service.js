
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import CustomerModel from '~/models/Customer.model'

const createCustomer = async (reqBody) => {
  try {
    const customer = await CustomerModel.create(reqBody)
    return customer
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

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
        .select(field),
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

const getCustomerById = async (id) => {
  try {
    const customer = await CustomerModel.findById(id)
    if (!customer) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Customer not found')
    }
    return customer
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

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

