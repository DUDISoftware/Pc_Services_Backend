import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { cloudinary } from '~/config/cloudinary'

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: 'images',
    format: file.mimetype.split('/')[1],
    public_id: Date.now() + '-' + file.originalname.split('.')[0],
    resource_type: 'image'
  })
})

const uploadImage = multer({ storage: cloudinaryStorage })

const cloudinaryFileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: 'documents',
    format: file.mimetype.split('/')[1],
    public_id: Date.now() + '-' + file.originalname.split('.')[0],
    resource_type: 'raw' // Use 'raw' for all file types, including pdf
  })
})

const uploadFile = multer({ storage: cloudinaryFileStorage })

export { uploadImage, uploadFile }
