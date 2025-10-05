import ApiError from '~/utils/ApiError.js'
import { StatusCodes } from 'http-status-codes'
import BannerModel from '~/models/Banner.model.js'
import { deleteImage } from '~/utils/cloudinary.js'

// Determine banner size based on layout and position
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

const getAllBanners = async () => {
  try {
    return await BannerModel.find().sort({ createdAt: -1 }).lean()
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

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
