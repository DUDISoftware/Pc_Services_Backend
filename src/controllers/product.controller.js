import { StatusCodes } from 'http-status-codes'
import { productService } from '~/services/product.service'

const createProduct = async (req, res, next) => {
  try {
    const files = req.files

    if (!files) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'Image files are required. Please make sure to send the files with field name "images"'
      })
    }
    const product = await productService.createProduct(req.body, files)
    res.status(StatusCodes.CREATED).json({
      status: 'success',
      message: 'Tạo product thành công',
      product
    })
  } catch (error) {
    next(error)
  }
}

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params
    const files = req.files
    const updatedProduct = await productService.updateProduct(id, req.body, files)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Cập nhật product thành công',
      product: updatedProduct
    })
  } catch (error) {
    next(error)
  }
}

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params
    await productService.deleteProduct(id)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Xoá product thành công'
    })
  } catch (error) {
    next(error)
  }
}

export const productController = {
  createProduct,
  updateProduct,
  deleteProduct
}
