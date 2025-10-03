import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import UserModel from '~/models/User.model.js'
import { jwtGenerate } from '~/utils/jwt.js'
import { redisClient } from '~/config/redis.js'
import sendEmail from '~/utils/sendMail.js'
import { hash } from 'bcrypt'

const generateAndSaveTokens = async (user_id, user_role) => {
  const { accessToken } = jwtGenerate({ id: user_id, role: user_role})
  return accessToken
}

const login = async (reqBody) => {
  const { username, password } = reqBody
  const user = await UserModel.findOne({ username })
    .select('_id username password role')
  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Tên đăng nhập hoặc mật khẩu không đúng')
  }
  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Tên đăng nhập hoặc mật khẩu không đúng')
  }
  const accessToken = await generateAndSaveTokens(user._id, user.role)
  const returnedUser = user.toObject()
  delete returnedUser.password // Remove password from the returned user object
  return { user: returnedUser, accessToken }
}

const register = async (reqBody) => {
  const existingUser = await UserModel.findOne({ username: reqBody.username })
  if (existingUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Tên đăng nhập đã tồn tại')
  }
  const user = new UserModel(reqBody)
  await user.save()
  const returnedUser = user.toObject()
  delete returnedUser.password // Remove password from the returned user object
  return returnedUser
}

const getProfile = async (userId) => {
  const user = await UserModel.findById(userId).select('-password')
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Người dùng không tồn tại')
  }
  return user
}

const getAllUsers = async () => {
  const users = await UserModel.find().select('-password')
  return users
}

const updateUser = async (userId, reqBody) => {
  const updateData = {
    ...reqBody,
    updated_at: Date.now()
  }

  const user = await UserModel.findById(userId)
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Người dùng không tồn tại')
  }
  if (user.role === 'admin') {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Không thể cập nhật thông tin của người dùng quản trị viên')
  }
  const userWithSameUsername = await UserModel.findOne({ username: reqBody.username, _id: { $ne: userId } })
  if (userWithSameUsername) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Tên đăng nhập đã tồn tại')
  }
  user.set(updateData)
  await user.save()
  return user
}

const deleteUser = async (userId) => {
  const user = await UserModel.findById(userId)
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Người dùng không tồn tại')
  }
  if (user.role === 'admin') {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Không thể xóa người dùng quản trị viên')
  }

  await user.deleteOne()
  return user
}

const sendOTP = async (email) => {
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString() // Generate a 6-digit OTP
  }
  const otp = generateOTP()
  await redisClient.set(email, otp)
  await redisClient.expire(email, 300) // OTP expires in 5 minutes
  await sendEmail(email, 'Mã xác thực của bạn', `Mã OTP là: ${otp}`)
}

const verifyEmail = async (email, otp) => {
  const storedOtp = await redisClient.get(email)
  if (!storedOtp || storedOtp !== otp) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'OTP không hợp lệ hoặc đã hết hạn')
  }
  if (storedOtp === otp) {
    await redisClient.del(email) // Remove OTP after successful verification
  }
}

export const userService = {
  login,
  register,
  sendEmail,
  sendOTP,
  verifyEmail,
  getProfile,
  getAllUsers,
  updateUser,
  deleteUser
}
