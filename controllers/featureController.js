const Feature = require('../models/Feature');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Barcha featurelarni olish
// @route   GET /api/v1/features
// @access  Public
exports.getFeatures = asyncHandler(async (req, res, next) => {
  // Filtering
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach((field) => delete queryObj[field]);

  // Advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

  let query = Feature.find(JSON.parse(queryStr));

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('order -createdAt');
  }

  // Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Feature.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Execute query
  const features = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: features.length,
    total,
    pagination,
    data: features,
  });
});

// @desc    Bitta feature olish
// @route   GET /api/v1/features/:id
// @access  Public
exports.getFeature = asyncHandler(async (req, res, next) => {
  const feature = await Feature.findById(req.params.id);

  if (!feature) {
    return next(new ErrorResponse(`Feature topilmadi: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: feature,
  });
});

// @desc    Yangi feature yaratish
// @route   POST /api/v1/features
// @access  Private/Admin
exports.createFeature = asyncHandler(async (req, res, next) => {
  const feature = await Feature.create(req.body);

  res.status(201).json({
    success: true,
    data: feature,
  });
});

// @desc    Feature yangilash
// @route   PUT /api/v1/features/:id
// @access  Private/Admin
exports.updateFeature = asyncHandler(async (req, res, next) => {
  let feature = await Feature.findById(req.params.id);

  if (!feature) {
    return next(new ErrorResponse(`Feature topilmadi: ${req.params.id}`, 404));
  }

  feature = await Feature.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: feature,
  });
});

// @desc    Feature o'chirish
// @route   DELETE /api/v1/features/:id
// @access  Private/Admin
exports.deleteFeature = asyncHandler(async (req, res, next) => {
  const feature = await Feature.findById(req.params.id);

  if (!feature) {
    return next(new ErrorResponse(`Feature topilmadi: ${req.params.id}`, 404));
  }

  await feature.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Active featurelarni olish
// @route   GET /api/v1/features/active
// @access  Public
exports.getActiveFeatures = asyncHandler(async (req, res, next) => {
  const features = await Feature.find({ isActive: true }).sort('order -createdAt');

  res.status(200).json({
    success: true,
    count: features.length,
    data: features,
  });
});
