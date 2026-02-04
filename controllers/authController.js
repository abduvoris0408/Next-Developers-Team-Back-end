const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Ro'yxatdan o'tish
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // User yaratish
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 201, res);
});

// @desc    Tizimga kirish
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Email va parolni tekshirish
  if (!email || !password) {
    return next(new ErrorResponse('Email va parol kiritilishi shart', 400));
  }

  // Userni topish (password bilan)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Email yoki parol noto\'g\'ri', 401));
  }

  // Parolni tekshirish
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Email yoki parol noto\'g\'ri', 401));
  }

  // Active ekanligini tekshirish
  if (!user.isActive) {
    return next(new ErrorResponse('Foydalanuvchi o\'chirilgan', 403));
  }

  // Last login yangilash
  user.lastLogin = Date.now();
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Tizimdan chiqish
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Joriy userni olish
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    User ma'lumotlarini yangilash
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Parolni yangilash
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Joriy parolni tekshirish
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Parol noto\'g\'ri', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// Helper function - token yaratish va cookie'ga saqlash
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};
