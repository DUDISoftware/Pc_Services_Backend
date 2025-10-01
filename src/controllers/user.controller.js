import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/user.service.js'

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
