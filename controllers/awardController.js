const Award = require('../models/Award');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Barcha awardlarni olish
// @route   GET /api/v1/awards
// @access  Public
exports.getAwards = asyncHandler(async (req, res, next) => {
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
  excludedFields.forEach((field) => delete queryObj[field]);

  if (req.query.search) {
    queryObj.$text = { $search: req.query.search };
  }

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

  let query = Award.find(JSON.parse(queryStr));

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-year order');
  }

  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Award.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);
  const awards = await query;

  const pagination = {};
  if (endIndex < total) pagination.next = { page: page + 1, limit };
  if (startIndex > 0) pagination.prev = { page: page - 1, limit };

  res.status(200).json({
    success: true,
    count: awards.length,
    total,
    pagination,
    data: awards,
  });
});

// @desc    Bitta awardni olish
// @route   GET /api/v1/awards/:id
// @access  Public
exports.getAward = asyncHandler(async (req, res, next) => {
  const award = await Award.findById(req.params.id);

  if (!award) {
    return next(new ErrorResponse(`Award topilmadi: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: award,
  });
});

// @desc    Yangi award yaratish
// @route   POST /api/v1/awards
// @access  Private/Admin
exports.createAward = asyncHandler(async (req, res, next) => {
  const award = await Award.create(req.body);

  res.status(201).json({
    success: true,
    data: award,
  });
});

// @desc    Award yangilash
// @route   PUT /api/v1/awards/:id
// @access  Private/Admin
exports.updateAward = asyncHandler(async (req, res, next) => {
  let award = await Award.findById(req.params.id);

  if (!award) {
    return next(new ErrorResponse(`Award topilmadi: ${req.params.id}`, 404));
  }

  award = await Award.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: award,
  });
});

// @desc    Award o'chirish
// @route   DELETE /api/v1/awards/:id
// @access  Private/Admin
exports.deleteAward = asyncHandler(async (req, res, next) => {
  const award = await Award.findById(req.params.id);

  if (!award) {
    return next(new ErrorResponse(`Award topilmadi: ${req.params.id}`, 404));
  }

  await award.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Yil bo'yicha awardlar
// @route   GET /api/v1/awards/year/:year
// @access  Public
exports.getAwardsByYear = asyncHandler(async (req, res, next) => {
  const awards = await Award.find({ 
    year: req.params.year,
    isActive: true 
  }).sort('order');

  res.status(200).json({
    success: true,
    count: awards.length,
    data: awards,
  });
});

// @desc    Award statistikasi
// @route   GET /api/v1/awards/stats/overview
// @access  Public
exports.getAwardStats = asyncHandler(async (req, res, next) => {
  const stats = await Award.aggregate([
    {
      $match: { isActive: true }
    },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  const totalAwards = await Award.countDocuments({ isActive: true });
  const recentAwards = await Award.find({ isActive: true })
    .sort('-year')
    .limit(5);

  res.status(200).json({
    success: true,
    data: {
      totalAwards,
      byCategory: stats,
      recent: recentAwards,
    },
  });
});
