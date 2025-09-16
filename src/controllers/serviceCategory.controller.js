// src/controllers/serviceCategory.controller.js
import { StatusCodes } from 'http-status-codes';
import { serviceCategoryService } from '~/services/serviceCategory.service.js'

const createCategory = async (req, res, next) => {
  try {
    const category = await serviceCategoryService.createCategory(req.body);
    res.status(StatusCodes.CREATED).json({
      status: 'success',
      message: 'Tạo danh mục dịch vụ thành công',
      category,
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await serviceCategoryService.updateCategory(
      req.params.id,
      req.body
    );
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Cập nhật danh mục thành công',
      category,
    });
  } catch (error) {
    next(error);
  }
};

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await serviceCategoryService.getAllCategories();
    res.status(StatusCodes.OK).json({ status: 'success', categories });
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const category = await serviceCategoryService.getCategoryById(req.params.id);
    res.status(StatusCodes.OK).json({ status: 'success', category });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    await serviceCategoryService.deleteCategory(req.params.id);
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Xóa danh mục dịch vụ thành công',
    });
  } catch (error) {
    next(error);
  }
};

export const serviceCategoryController = {
  createCategory,
  updateCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory,
};
