import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/user.service.js'

/**
 * Controller: Đăng nhập người dùng.
 *
 * ✅ Body:
 * - `username` (string, required)
 * - `password` (string, required)
 *
 * ✅ Response:
 * - 200 OK: `{ status, message, user, role, accessToken }`
 *   - Lưu ý: không trả về mật khẩu hoặc thông tin nhạy cảm.
 *
 * @param {import('express').Request} req Express Request
 * @param {import('express').Response} res Express Response
 * @param {import('express').NextFunction} next Express Next Function
 */
const login = async (req, res, next) => {
  try {
    const userData = await userService.login(req.body)

    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Đăng nhập thành công',
      user: userData.user,
      role: userData.user.role,
      accessToken: userData.accessToken
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Đăng ký tài khoản mới.
 *
 * ✅ Body:
 * - `username` (string, required)
 * - `password` (string, required, min length theo rule)
 * - `role` (optional) — nếu có (vd: admin/staff/user tùy hệ thống)
 *
 * ✅ Response:
 * - 201 Created: `{ status, message, user }`
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const register = async (req, res, next) => {
  try {
    const user = await userService.register(req.body)

    res.status(StatusCodes.CREATED).json({
      status: 'success',
      message: 'Tạo tài khoản thành công',
      user
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Lấy thông tin người dùng theo ID.
 *
 * ✅ Route: `GET /users/:id`
 *
 * ✅ Response:
 * - 200 OK: `{ status, message, user }`
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id
    const user = await userService.getProfile(userId)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Lấy thông tin người dùng thành công',
      user
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Lấy toàn bộ người dùng.
 *
 * ✅ Route: `GET /users`
 * (Nếu cần phân trang/lọc trong tương lai, thêm query params và truyền vào service.)
 *
 * ✅ Response:
 * - 200 OK: `{ status, message, users }`
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers()

    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Lấy thông tin người dùng thành công',
      users
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Cập nhật thông tin người dùng theo ID.
 *
 * ✅ Route: `PUT /users/:id`
 * ✅ Body: các trường cần cập nhật (vd: `username`, `password`, `role`, `status`, ...)
 *
 * ✅ Response:
 * - 200 OK: `{ status, message, user }`
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id
    const updatedUser = await userService.updateUser(userId, req.body)

    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Cập nhật thông tin người dùng thành công',
      user: updatedUser
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Xoá người dùng theo ID.
 *
 * ✅ Route: `DELETE /users/:id`
 *
 * ✅ Response:
 * - 200 OK: `{ status, message, user }`
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id
    const deletedUser = await userService.deleteUser(userId)

    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Xóa người dùng thành công',
      user: deletedUser
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Gửi email hệ thống.
 *
 * ✅ Body:
 * - `email` (string, required)
 * - `subject` (string, required)
 * - `text` (string, required)
 *
 * ✅ Response:
 * - 200 OK: `{ status, message }`
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const sendEmail = async (req, res, next) => {
  try {
    const { email, subject, text } = req.body
    await userService.sendEmail(email, subject, text)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Gửi email thành công'
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Gửi mã OTP đến email.
 *
 * ✅ Body:
 * - `email` (string, required)
 *
 * ✅ Response:
 * - 200 OK: `{ status, message }`
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const sendOTP = async (req, res, next) => {
  try {
    const { email } = req.body
    await userService.sendOTP(email)

    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Gửi mã OTP thành công'
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Xác thực email bằng OTP.
 *
 * ✅ Body:
 * - `email` (string, required)
 * - `otp` (string, length 6, required)
 *
 * ✅ Response:
 * - 200 OK: `{ status, message }`
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body
    await userService.verifyEmail(email, otp)

    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Xác thực email thành công'
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Bộ controller cho module User.
 *
 * Bao gồm:
 * - `login`: đăng nhập, trả về accessToken
 * - `register`: tạo tài khoản
 * - `getUserById`: lấy thông tin theo ID
 * - `getAllUsers`: lấy toàn bộ người dùng
 * - `updateUser`: cập nhật thông tin
 * - `deleteUser`: xoá người dùng
 * - `sendEmail`: gửi email hệ thống
 * - `sendOTP`: gửi mã OTP
 * - `verifyEmail`: xác thực OTP
 */
export const userController = {
  login,
  register,
  getUserById,
  getAllUsers,
  sendEmail,
  sendOTP,
  verifyEmail,
  updateUser,
  deleteUser
}
