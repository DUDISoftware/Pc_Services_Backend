import ApiError from '~/utils/ApiError.js'
import { StatusCodes } from 'http-status-codes'
import BannerModel from '~/models/Banner.model.js'
import { deleteImage } from '~/utils/cloudinary.js'

// Hàm xác định size theo layout + position
const getSizeByLayout = (layout, position) => {
  if (layout === 1) {
    // Option 1: 1 lớn trái + 2 nhỏ phải
    return position === 1 ? 'large' : 'small'
  }
  if (layout === 2) {
    // Option 2: 1 banner lớn, nếu thêm slot 2 thì = small
    return position === 1 ? 'large' : 'small'
  }
  if (layout === 3) {
    // Option 3: 2 banner lớn
    return 'large'
  }
  return 'large'
}

const getAllBanners = async () => {
  const banners = await BannerModel.find().sort({ createdAt: -1 }).lean()
  return banners
}

const createBanner = async (reqBody, file) => {
  const { layout, position } = reqBody

  const bannerData = {
    ...reqBody,
    size: getSizeByLayout(Number(layout), Number(position)), // ✅ set size tự động
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
  const { layout, position } = reqBody

  const updateBannerData = {
    ...reqBody,
    updatedAt: Date.now()
  }

  // Nếu có layout + position thì update size lại
  if (layout && position !== undefined) {
    updateBannerData.size = getSizeByLayout(Number(layout), Number(position))
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
}

const deleteBanner = async (id) => {
  const deletedBanner = await BannerModel.findByIdAndDelete(id)
  if (!deletedBanner) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Banner not found')
  }
  if (deletedBanner.image?.public_id) {
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
