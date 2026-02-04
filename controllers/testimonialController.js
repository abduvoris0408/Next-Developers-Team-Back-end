const Testimonial = require('../models/Testimonial');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Barcha testimoniallarni olish
// @route   GET /api/v1/testimonials
// @access  Public
exports.getTestimonials = asyncHandler(async (req, res, next) => {
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
  excludedFields.forEach((field) => delete queryObj[field]);

  if (req.query.search) {
    queryObj.$text = { $search: req.query.search };
  }

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

  let query = Testimonial.find(JSON.parse(queryStr)).populate('project', 'name slug mainImage');

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-isFeatured order -dateReceived');
  }

  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Testimonial.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);
  const testimonials = await query;

  const pagination = {};
  if (endIndex < total) pagination.next = { page: page + 1, limit };
  if (startIndex > 0) pagination.prev = { page: page - 1, limit };

  res.status(200).json({
    success: true,
    count: testimonials.length,
    total,
    pagination,
    data: testimonials,
  });
});

// @desc    Bitta testimonial olish
// @route   GET /api/v1/testimonials/:id
// @access  Public
exports.getTestimonial = asyncHandler(async (req, res, next) => {
  const testimonial = await Testimonial.findById(req.params.id).populate('project', 'name slug mainImage');

  if (!testimonial) {
    return next(new ErrorResponse(`Testimonial topilmadi: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: testimonial,
  });
});

// @desc    Yangi testimonial yaratish
// @route   POST /api/v1/testimonials
// @access  Private/Admin
exports.createTestimonial = asyncHandler(async (req, res, next) => {
  const testimonial = await Testimonial.create(req.body);

  res.status(201).json({
    success: true,
    data: testimonial,
  });
});

// @desc    Testimonial yangilash
// @route   PUT /api/v1/testimonials/:id
// @access  Private/Admin
exports.updateTestimonial = asyncHandler(async (req, res, next) => {
  let testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    return next(new ErrorResponse(`Testimonial topilmadi: ${req.params.id}`, 404));
  }

  testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: testimonial,
  });
});

// @desc    Testimonial o'chirish
// @route   DELETE /api/v1/testimonials/:id
// @access  Private/Admin
exports.deleteTestimonial = asyncHandler(async (req, res, next) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    return next(new ErrorResponse(`Testimonial topilmadi: ${req.params.id}`, 404));
  }

  await testimonial.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Featured testimoniallar
// @route   GET /api/v1/testimonials/featured/list
// @access  Public
exports.getFeaturedTestimonials = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit, 10) || 6;
  
  const testimonials = await Testimonial.find({ 
    isFeatured: true, 
    isActive: true,
    isVerified: true 
  })
    .populate('project', 'name slug')
    .sort('order -dateReceived')
    .limit(limit);

  res.status(200).json({
    success: true,
    count: testimonials.length,
    data: testimonials,
  });
});

// @desc    Reyting bo'yicha testimoniallar
// @route   GET /api/v1/testimonials/rating/:rating
// @access  Public
exports.getTestimonialsByRating = asyncHandler(async (req, res, next) => {
  const testimonials = await Testimonial.find({ 
    rating: { $gte: req.params.rating },
    isActive: true 
  })
    .populate('project', 'name slug')
    .sort('-rating -dateReceived');

  res.status(200).json({
    success: true,
    count: testimonials.length,
    data: testimonials,
  });
});

// @desc    Testimonial statistikasi
// @route   GET /api/v1/testimonials/stats/overview
// @access  Public
exports.getTestimonialStats = asyncHandler(async (req, res, next) => {
  const stats = await Testimonial.aggregate([
    {
      $match: { isActive: true }
    },
    {
      $group: {
        _id: null,
        totalCount: { $sum: 1 },
        avgRating: { $avg: '$rating' },
        fiveStars: {
          $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] }
        },
        fourStars: {
          $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] }
        },
        threeStars: {
          $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] }
        },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: stats[0] || {},
  });
});
