import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import CategoryModel from '~/models/Category.model'
import ProductModel from '~/models/Product.model'

const createCategory = async (reqBody) => {
  const categoryData = {
    ...reqBody
  }
  const category = new CategoryModel(categoryData)
  await category.save()
  return category
}

const updateCategory = async (id, reqBody) => {
  const updateCategoryData = {
    ...reqBody,
    updated_at: Date.now()
  }

  const category = await CategoryModel.findByIdAndUpdate(id, updateCategoryData, { new: true })
  if (!category) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
  }
  return category
}

const deleteCategory = async (id) => {
  const deletedCategory = await CategoryModel.findByIdAndDelete(id)
  if (!deletedCategory) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
  }
  // Also delete products associated with this category
  await ProductModel.updateMany({ category_id: id }, { $set: { category_id: null } })
  return deletedCategory
}

export const categoryService = {
  createCategory,
  updateCategory,
  deleteCategory
}