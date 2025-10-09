import { StatusCodes } from 'http-status-codes'
import { customerService } from '~/services/customer.service.js'

const getAll = async (req, res, next) => {
  try {
    const infos = await customerService.get()
    res.status(StatusCodes.OK).json(infos)
  } catch (error) {
    next(error)
  }
}
const create = async (req, res, next) => {
  try {
    const result = await customerService.create(req.body, req.files)
    res.status(StatusCodes.CREATED).json(result)
  } catch (err) {
    next(err)
  }
}

export const customerController = {
  getAll,
  create
}