import jwt from 'jsonwebtoken'
import { env } from '~/config/environment.js'
import ApiError from './ApiError'
import { StatusCodes } from 'http-status-codes'

const jwtGenerate = (payload) => {
  const accessToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN || '24h'
  })
  // const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
  //   expiresIn: env.JWT_REFRESH_EXPIRES_IN || '30d'
  // })
  // return { accessToken, refreshToken }
  return { accessToken }
}

const requestNewToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET)
    const newTokens = jwt.sign({ id: decoded.id, email: decoded.email, role: decoded.role }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN || '24h'
    })
    return newTokens
  } catch (error) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Refresh token đã hết hạn hoặc không hợp lệ')
  }
}

const jwtVerify = (token) => {
  try {
    return jwt.verify(token, env.JWT_SECRET)
  } catch (error) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Access Token không hợp lệ')
  }
}

const jwtVerifyRefresh = (token) => {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET)
  } catch (error) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Refresh Token không hợp lệ')
  }
}

export { jwtGenerate, requestNewToken, jwtVerify, jwtVerifyRefresh }