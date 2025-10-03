import { StatusCodes } from 'http-status-codes'
import { infoService } from '~/services/info.service.js'

const getAll = async (req, res, next) => {
  try {
    const infos = await infoService.get()
    res.status(StatusCodes.OK).json(infos)
  } catch (error) {
    next(error)
  }
}
const create = async (req, res, next) => {
  try {
    const result = await infoService.create(req.body, req.files)
    res.status(StatusCodes.CREATED).json(result)
  } catch (err) {
    next(err)
  }
}

const update = async (req, res, next) => {
  try {
    const result = await infoService.update(req.body, req.files)
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const sendEmail = async (req, res, next) => {
  try {
    const { email, subject, message } = req.body
    await infoService.sendEmail(email, subject, message)
    res.status(StatusCodes.OK).json({ message: 'Email sent successfully' })
  } catch (err) {
    next(err)
  }
}

export const infoController = {
  getAll,
  create,
  update,
  sendEmail
}