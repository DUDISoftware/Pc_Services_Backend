import { StatusCodes } from 'http-status-codes'
import { categoryService } from '~/services/category.service'

const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body)
    res.status(StatusCodes.CREATED).json({
      status: 'success',
      message: 'Tạo danh mục thành công',
      category
    })
  } catch (error) {
    next(error)
  }
}

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params
    const updatedCategory = await categoryService.updateCategory(id, req.body)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Cập nhật danh mục thành công',
      category: updatedCategory
    })
  } catch (error) {
    next(error)
  }
}

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params
    await categoryService.deleteCategory(id)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Xoá danh mục thành công'
    })
  } catch (error) {
    next(error)
  }
}

export const categoryController = {
  createCategory,
  updateCategory,
  deleteCategory
}
