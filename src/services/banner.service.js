import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import BannerModel from '~/models/Banner.model.js'
import { deleteImage } from '~/utils/cloudinary.js'
import { get } from 'mongoose'

const getAllBanners = async () => {
  const banners = await BannerModel.find().sort({ created_at: -1 })
  return banners
}

const createBanner = async (reqBody, file) => {
  const bannerData = {
    ...reqBody,
    image: {
      url: file.path,
      public_id: file.filename
    }
  }
  const banner = new BannerModel(bannerData)
  await banner.save()
  return banner
}

const updateBanner = async (id, reqBody, file) => {
  const updateBannerData = {
    ...reqBody,
    updated_at: Date.now()
  }

  if (file) {
    // If there's an existing image, delete it from Cloudinary
    const existingBanner = await BannerModel.findById(id)
    if (existingBanner && existingBanner.image && existingBanner.image.public_id) {
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
}

const deleteBanner = async (id) => {
  const deletedBanner = await BannerModel.findByIdAndDelete(id)
  if (!deletedBanner) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Banner not found')
  }
  // If there's an image, delete it from Cloudinary
  if (deletedBanner.image && deletedBanner.image.public_id) {
    await deleteImage(deletedBanner.image.public_id)
  }
  return deletedBanner
}

export const bannerService = {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner
}