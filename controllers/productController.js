const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Barcha productlarni olish
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
  excludedFields.forEach((field) => delete queryObj[field]);

  // Text search
  if (req.query.search) {
    queryObj.$text = { $search: req.query.search };
  }

  // Advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

  let query = Product.find(JSON.parse(queryStr)).populate('technologies', 'name icon category');

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-isFeatured order -createdAt');
  }

  // Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Product.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  const products = await query;

  const pagination = {};
  if (endIndex < total) {
    pagination.next = { page: page + 1, limit };
  }
  if (startIndex > 0) {
    pagination.prev = { page: page - 1, limit };
  }

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    pagination,
    data: products,
  });
});

// @desc    Bitta productni olish (ID yoki slug bo'yicha)
// @route   GET /api/v1/products/:idOrSlug
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { idOrSlug } = req.params;
  
  let product;
  
  // ID yoki slug ekanligini tekshirish
  if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
    product = await Product.findById(idOrSlug).populate('technologies', 'name icon logo category');
  } else {
    product = await Product.findOne({ slug: idOrSlug }).populate('technologies', 'name icon logo category');
  }

  if (!product) {
    return next(new ErrorResponse(`Product topilmadi: ${idOrSlug}`, 404));
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

// @desc    Yangi product yaratish
// @route   POST /api/v1/products
// @access  Private/Admin
exports.createProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    data: product,
  });
});

// @desc    Product yangilash
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product topilmadi: ${req.params.id}`, 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: product,
  });
});

// @desc    Product o'chirish
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product topilmadi: ${req.params.id}`, 404));
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Featured productlarni olish
// @route   GET /api/v1/products/featured/list
// @access  Public
exports.getFeaturedProducts = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit, 10) || 6;
  
  const products = await Product.find({ isFeatured: true, isActive: true })
    .populate('technologies', 'name icon')
    .sort('order -createdAt')
    .limit(limit);

  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
});

// @desc    Kategoriya bo'yicha productlar
// @route   GET /api/v1/products/category/:category
// @access  Public
exports.getProductsByCategory = asyncHandler(async (req, res, next) => {
  const products = await Product.find({ 
    category: req.params.category,
    isActive: true 
  }).populate('technologies', 'name icon');

  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
});

// @desc    Product statistikasi
// @route   GET /api/v1/products/stats/overview
// @access  Private/Admin
exports.getProductStats = asyncHandler(async (req, res, next) => {
  const stats = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        avgRating: { $avg: '$rating.average' },
        totalDownloads: { $sum: '$downloads' },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  const totalProducts = await Product.countDocuments();
  const activeProducts = await Product.countDocuments({ isActive: true });
  const featuredProducts = await Product.countDocuments({ isFeatured: true });

  res.status(200).json({
    success: true,
    data: {
      totalProducts,
      activeProducts,
      featuredProducts,
      byCategory: stats,
    },
  });
});
