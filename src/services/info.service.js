import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import InfoModel from '~/models/Info.model.js'
import sendMail from '~/utils/sendMail'

/**
 * Extracts file information from the provided files object.
 * Collects file URLs and filenames for terms, policy, payment, return, and cookies.
 *
 * @param {Object} filesObject - An object containing uploaded files.
 * @returns {Array<Object>} Array of file info objects with url and filename.
 */
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

/**
 * Creates a new Info document with the provided request body and file objects.
 * Handles file uploads for terms, policy, payment, return, and cookies fields.
 *
 * @async
 * @param {Object} reqBody - The request body containing info fields.
 * @param {Object} filesObject - An object containing uploaded files for terms, policy, payment, return, and cookies.
 * @returns {Promise<Object>} The newly created Info object.
 * @throws {ApiError} If an internal server error occurs during creation.
 */
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

/**
 * Retrieves the Info document from the database.
 * Returns all relevant fields including terms, policy, payment, return, and cookies.
 *
 * @async
 * @returns {Promise<Object>} The Info object.
 * @throws {ApiError} If the Info document is not found or an internal server error occurs.
 */
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

/**
 * Updates the Info document with the provided request body and file objects.
 * If no document exists, creates a new one.
 * Handles file uploads for terms, policy, payment, return, and cookies fields.
 * Returns the updated or newly created Info object with all relevant fields.
 *
 * @async
 * @param {Object} reqBody - The request body containing info fields to update.
 * @param {Object} filesObject - An object containing uploaded files for terms, policy, payment, return, and cookies.
 * @returns {Promise<Object>} The updated or newly created Info object.
 * @throws {ApiError} If an internal server error occurs during the update or creation process.
 */
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

/**
 * Sends an email using the provided email address, subject, and message.
 *
 * @async
 * @param {string} email - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} message - The message body of the email.
 * @throws {ApiError} If an internal server error occurs during email sending.
 */
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
