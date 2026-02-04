const Contact = require('../models/Contact');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Barcha contact so'rovlarini olish
// @route   GET /api/v1/contacts
// @access  Private/Admin
exports.getContacts = asyncHandler(async (req, res, next) => {
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
  excludedFields.forEach((field) => delete queryObj[field]);

  if (req.query.search) {
    queryObj.$text = { $search: req.query.search };
  }

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

  let query = Contact.find(JSON.parse(queryStr)).populate('assignedTo', 'name email');

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-priority -createdAt');
  }

  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Contact.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);
  const contacts = await query;

  const pagination = {};
  if (endIndex < total) pagination.next = { page: page + 1, limit };
  if (startIndex > 0) pagination.prev = { page: page - 1, limit };

  res.status(200).json({
    success: true,
    count: contacts.length,
    total,
    pagination,
    data: contacts,
  });
});

// @desc    Bitta contact so'rovini olish
// @route   GET /api/v1/contacts/:id
// @access  Private/Admin
exports.getContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id)
    .populate('assignedTo', 'name email')
    .populate('notes.addedBy', 'name email');

  if (!contact) {
    return next(new ErrorResponse(`Contact topilmadi: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: contact,
  });
});

// @desc    Yangi contact so'rovi yaratish
// @route   POST /api/v1/contacts
// @access  Public
exports.createContact = asyncHandler(async (req, res, next) => {
  // IP address va user agent qo'shish
  req.body.ipAddress = req.ip || req.connection.remoteAddress;
  req.body.userAgent = req.get('user-agent');

  const contact = await Contact.create(req.body);

  // Email yuborish funksiyasini keyinchalik qo'shamiz
  // await sendContactEmail(contact);

  res.status(201).json({
    success: true,
    message: 'Xabaringiz qabul qilindi. Tez orada siz bilan bog\'lanamiz!',
    data: contact,
  });
});

// @desc    Contact so'rovini yangilash
// @route   PUT /api/v1/contacts/:id
// @access  Private/Admin
exports.updateContact = asyncHandler(async (req, res, next) => {
  let contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ErrorResponse(`Contact topilmadi: ${req.params.id}`, 404));
  }

  contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: contact,
  });
});

// @desc    Contact so'rovini o'chirish
// @route   DELETE /api/v1/contacts/:id
// @access  Private/Admin
exports.deleteContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ErrorResponse(`Contact topilmadi: ${req.params.id}`, 404));
  }

  await contact.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Contact so'roviga note qo'shish
// @route   POST /api/v1/contacts/:id/notes
// @access  Private/Admin
exports.addNote = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ErrorResponse(`Contact topilmadi: ${req.params.id}`, 404));
  }

  contact.notes.push({
    note: req.body.note,
    addedBy: req.user.id,
  });

  await contact.save();

  res.status(200).json({
    success: true,
    data: contact,
  });
});

// @desc    Contact so'rovini assign qilish
// @route   PUT /api/v1/contacts/:id/assign/:userId
// @access  Private/Admin
exports.assignContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ErrorResponse(`Contact topilmadi: ${req.params.id}`, 404));
  }

  contact.assignedTo = req.params.userId;
  await contact.save();

  res.status(200).json({
    success: true,
    data: contact,
  });
});

// @desc    Contact statistikasi
// @route   GET /api/v1/contacts/stats/overview
// @access  Private/Admin
exports.getContactStats = asyncHandler(async (req, res, next) => {
  const stats = await Contact.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const totalContacts = await Contact.countDocuments();
  const newContacts = await Contact.countDocuments({ status: 'new' });
  const priorityStats = await Contact.aggregate([
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalContacts,
      newContacts,
      byStatus: stats,
      byPriority: priorityStats,
    },
  });
});
