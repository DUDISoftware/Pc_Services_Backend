import { StatusCodes } from 'http-status-codes'
import { bannerService } from '~/services/banner.service.js'
const getAllBanners = async (req, res, next) => {
  try {
    const banners = await bannerService.getAllBanners()
    res.status(StatusCodes.OK).json({
      status: 'success',
      banners
    })
  } catch (error) {
    next(error)
  }
}

const createBanner = async (req, res, next) => {
  try {
    const file = req.file
    if (!file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'Image file is required. Please send the file with field name "image"'
      })
    }

    const banner = await bannerService.createBanner(req.body, file)
    res.status(StatusCodes.CREATED).json({
      status: 'success',
      message: 'Tạo banner thành công',
      banner
    })
  } catch (error) {
    next(error)
  }
}

const updateBanner = async (req, res, next) => {
  try {
    const { id } = req.params
    const file = req.file
    const updatedBanner = await bannerService.updateBanner(id, req.body, file)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Cập nhật banner thành công',
      banner: updatedBanner
    })
  } catch (error) {
    next(error)
  }
}

const deleteBanner = async (req, res, next) => {
  try {
    const { id } = req.params
    await bannerService.deleteBanner(id)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Xoá banner thành công'
    })
  } catch (error) {
    next(error)
  }
}

export const bannerController = {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner
}