const TeamMember = require('../models/TeamMember');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Barcha team memberlarni olish
// @route   GET /api/v1/team
// @access  Public
exports.getTeamMembers = asyncHandler(async (req, res, next) => {
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
  excludedFields.forEach((field) => delete queryObj[field]);

  if (req.query.search) {
    queryObj.$text = { $search: req.query.search };
  }

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

  let query = TeamMember.find(JSON.parse(queryStr)).populate('skills', 'name icon logo');

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-isFeatured order -createdAt');
  }

  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await TeamMember.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);
  const teamMembers = await query;

  const pagination = {};
  if (endIndex < total) pagination.next = { page: page + 1, limit };
  if (startIndex > 0) pagination.prev = { page: page - 1, limit };

  res.status(200).json({
    success: true,
    count: teamMembers.length,
    total,
    pagination,
    data: teamMembers,
  });
});

// @desc    Bitta team memberni olish
// @route   GET /api/v1/team/:id
// @access  Public
exports.getTeamMember = asyncHandler(async (req, res, next) => {
  const teamMember = await TeamMember.findById(req.params.id).populate('skills', 'name icon logo category');

  if (!teamMember) {
    return next(new ErrorResponse(`Team member topilmadi: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: teamMember,
  });
});

// @desc    Yangi team member yaratish
// @route   POST /api/v1/team
// @access  Private/Admin
exports.createTeamMember = asyncHandler(async (req, res, next) => {
  const teamMember = await TeamMember.create(req.body);

  res.status(201).json({
    success: true,
    data: teamMember,
  });
});

// @desc    Team member yangilash
// @route   PUT /api/v1/team/:id
// @access  Private/Admin
exports.updateTeamMember = asyncHandler(async (req, res, next) => {
  let teamMember = await TeamMember.findById(req.params.id);

  if (!teamMember) {
    return next(new ErrorResponse(`Team member topilmadi: ${req.params.id}`, 404));
  }

  teamMember = await TeamMember.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: teamMember,
  });
});

// @desc    Team member o'chirish
// @route   DELETE /api/v1/team/:id
// @access  Private/Admin
exports.deleteTeamMember = asyncHandler(async (req, res, next) => {
  const teamMember = await TeamMember.findById(req.params.id);

  if (!teamMember) {
    return next(new ErrorResponse(`Team member topilmadi: ${req.params.id}`, 404));
  }

  await teamMember.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Featured team memberlar
// @route   GET /api/v1/team/featured/list
// @access  Public
exports.getFeaturedTeamMembers = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit, 10) || 8;
  
  const teamMembers = await TeamMember.find({ isFeatured: true, isActive: true })
    .populate('skills', 'name icon')
    .sort('order -createdAt')
    .limit(limit);

  res.status(200).json({
    success: true,
    count: teamMembers.length,
    data: teamMembers,
  });
});

// @desc    Department bo'yicha team memberlar
// @route   GET /api/v1/team/department/:department
// @access  Public
exports.getTeamByDepartment = asyncHandler(async (req, res, next) => {
  const teamMembers = await TeamMember.find({ 
    department: req.params.department,
    isActive: true 
  }).populate('skills', 'name icon');

  res.status(200).json({
    success: true,
    count: teamMembers.length,
    data: teamMembers,
  });
});
