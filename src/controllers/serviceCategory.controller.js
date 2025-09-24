// src/controllers/serviceCategory.controller.js
import { StatusCodes } from 'http-status-codes';
import { serviceCategoryService } from '~/services/serviceCategory.service.js'
import { searchServiceCategories as searchService } from '~/services/search.service.js'

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

const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await serviceCategoryService.getCategoryBySlug(req.params.slug);
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

const searchCategories = async (req, res, next) => {
  try {
    let { query, page = 1, limit = 10 } = req.query;

    if (!query || query.trim() === '') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'fail',
        message: 'Query parameter is required',
      });
    }

    const results = await searchService(query, page, limit);
    res.status(StatusCodes.OK).json({
      status: 'success',
      results,
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
  getCategoryBySlug,
  deleteCategory,
  searchCategories
};
