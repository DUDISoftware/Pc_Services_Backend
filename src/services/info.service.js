import ApiError from '~/utils/ApiError';
import { StatusCodes } from 'http-status-codes';
import InfoModel from '~/models/Info.model.js';

const extractFiles = (filesObject) => {
  const collected = [];

  if (filesObject?.terms?.[0]) {
    collected.push({
      url: filesObject.terms[0].path,
      filename: filesObject.terms[0].filename,
    });
  }

  if (filesObject?.policy?.[0]) {
    collected.push({
      url: filesObject.policy[0].path,
      filename: filesObject.policy[0].filename,
    });
  }

  return collected;
};

const create = async (reqBody, filesObject) => {
  const termsUrl = filesObject?.terms?.[0]?.path;
  const policyUrl = filesObject?.policy?.[0]?.path;

  const info = new InfoModel({
    ...reqBody,
    terms: termsUrl,
    policy: policyUrl
  });

  await info.save();
  return info;
};


const get = async () => {
  const info = await InfoModel.findOne();
  if (!info) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Info not found');
  }
  return info;
};

const update = async (reqBody, filesObject) => {
  const updateData = {
    ...reqBody,
    updatedAt: Date.now()
  };

  if (filesObject?.terms?.[0]) {
    updateData.terms = filesObject.terms[0].path;
  }

  if (filesObject?.policy?.[0]) {
    updateData.policy = filesObject.policy[0].path;
  }

  const info = await InfoModel.findOneAndUpdate({}, updateData, { new: true });

  if (!info) {
    return await create(reqBody, filesObject);
  }

  return info;
};


export const infoService = {
  create,
  get,
  update,
};
