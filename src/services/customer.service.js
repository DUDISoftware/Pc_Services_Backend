import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import Customer from '~/models/Customer.model.js'


const create = async (reqBody, filesObject) => {
  try {
    const customer = new Customer({
      name: reqBody.name,
      email: reqBody.email,
      phone: reqBody.phone
    })
    await customer.save()
    return customer
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

const get = async () => {
  try {
    const customer = await Customer.findOne()
    if (!customer) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Customer not found')
    }
    return customer
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

export const customerService = {
  create,
  get
}
