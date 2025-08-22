import { cloudinary } from '~/config/cloudinary'

const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' })
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error)
    throw new Error('Failed to delete image')
  }
}

export { deleteImage }
