import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import Repair from '~/models/RepairRequest.model.js'

const createRequest = async (reqBody) => {
    const newRequest = new Repair(reqBody)
    await newRequest.save()
    return newRequest
}

const updateRequest = async (id, reqBody) => {
    const updateData = {
        ...reqBody,
        updatedAt: Date.now()
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