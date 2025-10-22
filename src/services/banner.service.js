import ApiError from '~/utils/ApiError.js'
import { StatusCodes } from 'http-status-codes'
import BannerModel from '~/models/Banner.model.js'
import { deleteImage } from '~/utils/cloudinary.js'

/**
 * Determines the banner size based on layout and position.
 * Returns 'large' or 'small' depending on the layout and position values.
 *
 * @param {number} layout - The layout type of the banner.
 * @param {number} position - The position of the banner.
 * @returns {string} The size of the banner ('large' or 'small').
 */
const getSizeByLayout = (layout, position) => {
  switch (Number(layout)) {
  case 1:
    return position === 1 ? 'large' : 'small'
  case 2:
    return position === 1 ? 'large' : 'small'
  case 3:
    return 'large'
  default:
    return 'large'
  }
}

/**
 * Retrieves all banners with pagination.
 * Returns a list of banners sorted by last update time.
 *
 * @param {number} [limit=10] - Number of banners per page.
 * @param {number} [page=1] - Page number to retrieve.
 * @returns {Promise<Array>} Array of banner objects.
 * @throws {ApiError} If an internal server error occurs.
 */
const getAllBanners = async (limit = 10, page = 1) => {
  try {
    const skip = (page - 1) * limit
    return await BannerModel.find().sort({ updatedAt: -1 }).skip(skip).limit(limit).lean()
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

/**
 * Creates a new banner with provided data and image file.
 * Sets banner size based on layout and position.
 *
 * @param {Object} reqBody - The request body containing banner data.
 * @param {Object} file - File object containing image data.
 * @returns {Promise<Object>} The created banner object.
 * @throws {ApiError} If an internal server error occurs.
 */
const createBanner = async (reqBody, file) => {
  try {
    const { layout, position } = reqBody
    const bannerData = {
      ...reqBody,
      size: getSizeByLayout(layout, position),
      image: {
        url: file.path,
        public_id: file.filename
      }
    }
    const banner = await BannerModel.create(bannerData)
    return banner
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

/**
 * Updates a banner by its ID with new data and optionally a new image.
 * Handles image replacement and updates banner size based on layout and position.
 * Throws an error if the banner is not found or if an internal error occurs.
 *
 * @param {string} id - The ID of the banner to update.
 * @param {Object} reqBody - The request body containing banner data.
 * @param {Object} [file] - Optional file object containing image data.
 * @returns {Promise<Object>} The updated banner object.
 * @throws {ApiError} If the banner is not found or an internal server error occurs.
 */
const updateBanner = async (id, reqBody, file) => {
  try {
    const { layout, position } = reqBody
    const updateBannerData = {
      ...reqBody,
      updatedAt: Date.now()
    }

    if (layout !== undefined && position !== undefined) {
      updateBannerData.size = getSizeByLayout(layout, position)
    }

    if (file) {
      const existingBanner = await BannerModel.findById(id)
      if (existingBanner?.image?.public_id) {
        await deleteImage(existingBanner.image.public_id)
      }
      updateBannerData.image = {
        url: file.path,
        public_id: file.filename
      }
    }

    const banner = await BannerModel.findByIdAndUpdate(id, updateBannerData, { new: true })
    if (!banner) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Banner not found')
    }
    return banner
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

/**
 * Deletes a banner by its ID and removes its image from cloud storage.
 * Throws an error if the banner is not found or if an internal error occurs.
 *
 * @param {string} id - The ID of the banner to delete.
 * @returns {Promise<Object>} The deleted banner object.
 * @throws {ApiError} If the banner is not found or an internal server error occurs.
 */
const deleteBanner = async (id) => {
  try {
    const deletedBanner = await BannerModel.findByIdAndDelete(id)
    if (!deletedBanner) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Banner not found')
    }
    if (deletedBanner.image?.public_id) {
      await deleteImage(deletedBanner.image.public_id)
    }
    return deletedBanner
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

export const bannerService = {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner
}
