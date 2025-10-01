import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import Repair from '~/models/RepairRequest.model.js'
import { deleteImage } from '~/utils/cloudinary.js'
import { redisClient } from '~/config/redis.js'

const createRequest = async (reqBody, files) => {
  const requestData = {
    ...reqBody,
    images: files?.map(file => ({
      url: file.path,
      public_id: file.filename
    })) || []
  }
  const newRequest = new Repair(requestData)
  await newRequest.save()
  return newRequest
}

const updateRequest = async (id, reqBody, files) => {
  const updateData = {
    ...reqBody,
    updatedAt: Date.now()
  }

  if (files && files.length > 0) {
    updateData.images = files.map(file => ({
      url: file.path,
      public_id: file.filename
    }))
  }

  const updated = await Repair.findByIdAndUpdate(id, updateData, { new: true })
  if (!updated) throw new ApiError(StatusCodes.NOT_FOUND, 'Request not found')
  return updated
}

const hideRequest = async (id) => {
  const updateData = {
    hidden: true,
    updatedAt: Date.now()
  }
  const updated = await Repair.findByIdAndUpdate(id, updateData, { new: true })
  if (!updated) throw new ApiError(StatusCodes.NOT_FOUND, 'Request not found')
  return updated
}

const getAllRequests = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit
  const requests = await Repair.find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
  return requests
}

const getRequestById = async (id) => {
  const request = await Repair.findById(id)
  return request
}

const deleteRequest = async (id) => {
  const result = await Repair.findByIdAndDelete(id)
  if (!result) throw new ApiError(StatusCodes.NOT_FOUND, 'Request not found')
  // Delete images from cloudinary
  if (result.images && result.images.length > 0) {
    await Promise.all(result.images.map(image => deleteImage(image.public_id)))
  }
}

const getFeaturedServices = async (limit = 4) => {
  const keys = [];
  let cursor = 0;

  do {
    const reply = await redisClient.scan(String(cursor), {
      MATCH: 'service:*:views',
      COUNT: 10,
    });
    cursor = String(reply.cursor);
    keys.push(...reply.keys);
  } while (String(cursor) !== '0');

  if (keys.length === 0) return [];

  const values = await redisClient.mGet(keys);

  const featured = keys.map((key, i) => {
    const id = key.split(':')[1];
    const raw = values[i];
    return {
      id: id,
      views: raw ? parseInt(raw, 10) : 0, // convert từ string về number
    };
  });
  featured.sort((a, b) => b.views - a.views); // sắp xếp giảm dần theo views
  return featured.slice(0, limit); // lấy top 4
};

const getServiceViews = async (id) => {
  const key = `service:${id}:views`
  const views = await redisClient.get(key)
  return views ? parseInt(views, 10) : 0
}

const countViewRedis = async (id) => {
  const key = `service:${id}:views`
  const views = await redisClient.incrBy(key, 1)
  await redisClient.expire(key, 60 * 60 * 24 * 7) // expire in 1 week
  return views
}

export const repairService = {
  createRequest,
  updateRequest,
  hideRequest,
  getRequestById,
  getAllRequests,
  deleteRequest,
  getFeaturedServices,
  getServiceViews,
  countViewRedis
}