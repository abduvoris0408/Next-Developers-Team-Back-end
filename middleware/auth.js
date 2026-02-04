const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Token bilan himoyalangan route'lar uchun
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Token headerdan yoki cookie'dan olish
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Token mavjudligini tekshirish
  if (!token) {
    return next(new ErrorResponse('Bu route\'ga kirish uchun avtorizatsiya talab qilinadi', 401));
  }

  try {
    // Token tekshirish
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Foydalanuvchini topish
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new ErrorResponse('Foydalanuvchi topilmadi', 404));
    }

    if (!req.user.isActive) {
      return next(new ErrorResponse('Foydalanuvchi o\'chirilgan', 403));
    }

    next();
  } catch (err) {
    return next(new ErrorResponse('Avtorizatsiya xatosi', 401));
  }
});

// Role tekshirish
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `${req.user.role} roli bu amalni bajarish uchun ruxsat etilmagan`,
          403
        )
      );
    }
    next();
  };
};
