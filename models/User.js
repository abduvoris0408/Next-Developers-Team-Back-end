const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Ism kiritilishi shart'],
      trim: true,
      maxlength: [100, 'Ism 100 belgidan oshmasligi kerak'],
    },
    email: {
      type: String,
      required: [true, 'Email kiritilishi shart'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Email formati noto\'g\'ri',
      ],
    },
    password: {
      type: String,
      required: [true, 'Parol kiritilishi shart'],
      minlength: [6, 'Parol kamida 6 belgidan iborat bo\'lishi kerak'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'super-admin'],
      default: 'user',
    },
    avatar: {
      public_id: String,
      url: String,
    },
    phone: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Password hash
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password tekshirish
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// JWT Token yaratish
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model('User', UserSchema);
