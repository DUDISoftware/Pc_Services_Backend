import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import UserModel from '~/models/User.model.js'
import { jwtGenerate } from '~/utils/jwt.js'
import { redisClient } from '~/config/redis.js'
import sendEmail from '~/utils/sendMail.js'

const generateAccessToken = async (user_id, user_role) => {
  const { accessToken } = jwtGenerate({ id: user_id, role: user_role })
  return accessToken
}

const login = async ({ username, password }) => {
  const user = await UserModel.findOne({ username }).select('_id username password role')
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Tên đăng nhập hoặc mật khẩu không đúng')
  }
  const accessToken = await generateAccessToken(user._id, user.role)
  const returnedUser = user.toObject()
  delete returnedUser.password
  return { user: returnedUser, accessToken }
}

const register = async (reqBody) => {
  if (await UserModel.findOne({ username: reqBody.username })) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Tên đăng nhập đã tồn tại')
  }
  const user = new UserModel(reqBody)
  await user.save()
  const returnedUser = user.toObject()
  delete returnedUser.password
  return returnedUser
}

const getProfile = async (userId) => {
  const user = await UserModel.findById(userId).select('-password')
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Người dùng không tồn tại')
  }
  return user
}

const getAllUsers = async (filter = {}) => {
  return await UserModel.find(filter).select('-password')
}

const updateUser = async (userId, reqBody) => {
  const user = await UserModel.findById(userId)
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Người dùng không tồn tại')
  }
  if (user.role === 'admin') {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Không thể cập nhật thông tin của người dùng quản trị viên')
  }
  if (reqBody.username && await UserModel.findOne({ username: reqBody.username, _id: { $ne: userId } })) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Tên đăng nhập đã tồn tại')
  }
  user.set({ ...reqBody, updated_at: Date.now() })
  await user.save()
  const returnedUser = user.toObject()
  delete returnedUser.password
  return returnedUser
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
  const returnedUser = user.toObject()
  delete returnedUser.password
  return returnedUser
}

const sendOTP = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  await redisClient.set(email, otp, 'EX', 300) // Set with expiry in one command
  await sendEmail(email, 'Mã xác thực của bạn', `Mã OTP là: ${otp}`)
}

const verifyEmail = async (email, otp) => {
  const storedOtp = await redisClient.get(email)
  if (!storedOtp || storedOtp !== otp) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'OTP không hợp lệ hoặc đã hết hạn')
  }
  await redisClient.del(email)
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
