const Technology = require('../models/Technology');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Barcha texnologiyalarni olish
// @route   GET /api/v1/technologies
// @access  Public
exports.getTechnologies = asyncHandler(async (req, res, next) => {
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
  excludedFields.forEach((field) => delete queryObj[field]);

  if (req.query.search) {
    queryObj.$text = { $search: req.query.search };
  }

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

  let query = Technology.find(JSON.parse(queryStr));

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-isFeatured order name');
  }

  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Technology.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);
  const technologies = await query;

  const pagination = {};
  if (endIndex < total) pagination.next = { page: page + 1, limit };
  if (startIndex > 0) pagination.prev = { page: page - 1, limit };

  res.status(200).json({
    success: true,
    count: technologies.length,
    total,
    pagination,
    data: technologies,
  });
});

// @desc    Bitta texnologiyani olish (ID yoki slug)
// @route   GET /api/v1/technologies/:idOrSlug
// @access  Public
exports.getTechnology = asyncHandler(async (req, res, next) => {
  const { idOrSlug } = req.params;
  let technology;

  if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
    technology = await Technology.findById(idOrSlug);
  } else {
    technology = await Technology.findOne({ slug: idOrSlug });
  }

  if (!technology) {
    return next(new ErrorResponse(`Texnologiya topilmadi: ${idOrSlug}`, 404));
  }

  res.status(200).json({
    success: true,
    data: technology,
  });
});

// @desc    Yangi texnologiya yaratish
// @route   POST /api/v1/technologies
// @access  Private/Admin
exports.createTechnology = asyncHandler(async (req, res, next) => {
  const technology = await Technology.create(req.body);

  res.status(201).json({
    success: true,
    data: technology,
  });
});

// @desc    Texnologiya yangilash
// @route   PUT /api/v1/technologies/:id
// @access  Private/Admin
exports.updateTechnology = asyncHandler(async (req, res, next) => {
  let technology = await Technology.findById(req.params.id);

  if (!technology) {
    return next(new ErrorResponse(`Texnologiya topilmadi: ${req.params.id}`, 404));
  }

  technology = await Technology.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: technology,
  });
});

// @desc    Texnologiya o'chirish
// @route   DELETE /api/v1/technologies/:id
// @access  Private/Admin
exports.deleteTechnology = asyncHandler(async (req, res, next) => {
  const technology = await Technology.findById(req.params.id);

  if (!technology) {
    return next(new ErrorResponse(`Texnologiya topilmadi: ${req.params.id}`, 404));
  }

  await technology.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Kategoriya bo'yicha texnologiyalar
// @route   GET /api/v1/technologies/category/:category
// @access  Public
exports.getTechnologiesByCategory = asyncHandler(async (req, res, next) => {
  const technologies = await Technology.find({ 
    category: req.params.category,
    isActive: true 
  }).sort('order name');

  res.status(200).json({
    success: true,
    count: technologies.length,
    data: technologies,
  });
});

// @desc    Featured texnologiyalar
// @route   GET /api/v1/technologies/featured/list
// @access  Public
exports.getFeaturedTechnologies = asyncHandler(async (req, res, next) => {
  const technologies = await Technology.find({ isFeatured: true, isActive: true })
    .sort('order name');

  res.status(200).json({
    success: true,
    count: technologies.length,
    data: technologies,
  });
});
