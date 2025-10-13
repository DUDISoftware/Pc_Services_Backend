import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import InfoModel from '~/models/Info.model.js'
import sendMail from '~/utils/sendMail'

const extractFiles = (filesObject) => {
  const collected = [];
  ['terms', 'policy', 'payment', 'return', 'cookies'].forEach((key) => {
    if (filesObject?.[key]?.[0]) {
      collected.push({
        url: filesObject[key][0].path,
        filename: filesObject[key][0].filename
      })
    }
  })
  return collected
}

const create = async (reqBody, filesObject) => {
  try {
    const info = new InfoModel({
      ...reqBody,
      terms: filesObject?.terms?.[0]?.path || '',
      policy: filesObject?.policy?.[0]?.path || '',
      payment: filesObject?.payment?.[0]?.path || '',
      return: filesObject?.return?.[0]?.path || '',
      cookies: filesObject?.cookies?.[0]?.path || ''
    })
    await info.save()
    return info
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

const get = async () => {
  try {
    const info = await InfoModel.findOne()
    if (!info) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Info not found')
    }
    // Add fields for all get methods
    return {
      _id: info._id,
      terms: info.terms,
      policy: info.policy,
      payment: info.payment,
      return: info.return,
      cookies: info.cookies,
      createdAt: info.createdAt,
      updatedAt: info.updatedAt,
      ...info.toObject()
    }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

const update = async (reqBody, filesObject) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }

    if (filesObject?.terms?.[0]?.path) {
      updateData.terms = filesObject.terms[0].path
    }
    if (filesObject?.policy?.[0]?.path) {
      updateData.policy = filesObject.policy[0].path
    }
    if (filesObject?.payment?.[0]?.path) {
      updateData.payment = filesObject.payment[0].path
    }
    if (filesObject?.return?.[0]?.path) {
      updateData.return = filesObject.return[0].path
    }
    if (filesObject?.cookies?.[0]?.path) {
      updateData.cookies = filesObject.cookies[0].path
    }

    let info = await InfoModel.findOneAndUpdate({}, updateData, { new: true })
    if (!info) {
      info = await create(reqBody, filesObject)
    }
    // Add fields for all get methods
    return {
      _id: info._id,
      terms: info.terms,
      policy: info.policy,
      payment: info.payment,
      return: info.return,
      cookies: info.cookies,
      createdAt: info.createdAt,
      updatedAt: info.updatedAt,
      ...info.toObject()
    }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

const sendEmail = async (email, subject, message) => {
  try {
    await sendMail(email, subject, message)
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

export const infoService = {
  create,
  get,
  update,
  sendEmail
}
