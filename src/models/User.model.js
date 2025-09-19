import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false
  }
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    index: true,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'staff'],
    default: 'staff'
  },
  status: {
    type: String,
    enum: ['active', 'locked'],
    default: 'active'
  }
},
{
  collection: 'users'
}, schemaOptions
)

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  }
  next()
})

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

const UserModel = mongoose.model('users', userSchema)

export default UserModel