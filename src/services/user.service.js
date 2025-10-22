import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import UserModel from '~/models/User.model.js'
import { jwtGenerate } from '~/utils/jwt.js'
import { redisClient } from '~/config/redis.js'
import sendEmail from '~/utils/sendMail.js'

/**
 * Generates a JWT access token for a user.
 *
 * @param {string} user_id - The user's ID.
 * @param {string} user_role - The user's role.
 * @returns {Promise<string>} The generated access token.
 */
const generateAccessToken = async (user_id, user_role) => {
  const { accessToken } = jwtGenerate({ id: user_id, role: user_role })
  return accessToken
}

/**
 * Authenticates a user by username and password.
 * - Throws an error if credentials are invalid.
 * - Removes the password field from the returned user object.
 *
 * @param {Object} param0 - Object containing username and password.
 * @returns {Promise<Object>} The authenticated user and access token.
 * @throws {ApiError} If credentials are invalid.
 */
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

/**
 * Registers a new user.
 * - Throws an error if the username already exists.
 * - Removes the password field from the returned user object.
 *
 * @param {Object} reqBody - The request body containing user information.
 * @returns {Promise<Object>} The registered user object without the password field.
 * @throws {ApiError} If the username already exists.
 */
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

/**
 * Retrieves a user's profile by user ID.
 * - Throws an error if the user does not exist.
 *
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Object>} The user object without the password field.
 * @throws {ApiError} If the user is not found.
 */
const getProfile = async (userId) => {
  const user = await UserModel.findById(userId).select('-password')
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Người dùng không tồn tại')
  }
  return user
}

/**
 * Retrieves all users matching the filter.
 * - Excludes the password field from returned user objects.
 *
 * @param {Object} filter - The filter criteria.
 * @returns {Promise<Array>} Array of user objects without the password field.
 */
const getAllUsers = async (filter = {}) => {
  return await UserModel.find(filter).select('-password')
}

/**
 * Updates a user's information by user ID, excluding admin users.
 * - Throws an error if the user does not exist.
 * - Prevents updating admin user information.
 * - Checks for duplicate usernames.
 * - Removes the password field from the returned user object.
 *
 * @param {string} userId - The ID of the user to update.
 * @param {Object} reqBody - The request body containing updated user fields.
 * @returns {Promise<Object>} The updated user object without the password field.
 * @throws {ApiError} If the user is not found, is an admin, or the username already exists.
 */
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

/**
 * Deletes a user by user ID, excluding admin users.
 * - Throws an error if the user does not exist.
 * - Prevents deleting admin users.
 * - Removes the password field from the returned user object.
 *
 * @param {string} userId - The ID of the user to delete.
 * @returns {Promise<Object>} The deleted user object without the password field.
 * @throws {ApiError} If the user is not found or is an admin.
 */
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

/**
 * Sends an OTP code to the specified email address.
 * - Stores the OTP in Redis with a 3-minute expiry.
 *
 * @param {string} email - The email address to send the OTP to.
 * @returns {Promise<void>}
 */
const sendOTP = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  await redisClient.set(email, otp, {EX: 180}) // Set with expiry in one command
  await sendEmail(email, 'Mã xác thực của bạn', `Mã OTP là: ${otp}`)
}

/**
 * Verifies the OTP code for the specified email address.
 * - Throws an error if the OTP is invalid or expired.
 * - Deletes the OTP from Redis after verification.
 *
 * @param {string} email - The email address to verify.
 * @param {string} otp - The OTP code to verify.
 * @returns {Promise<void>}
 * @throws {ApiError} If the OTP is invalid or expired.
 */
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
