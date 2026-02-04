const Attendance = require('../models/Attendance');
const TeamMember = require('../models/TeamMember');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Barcha davomatlarni olish
// @route   GET /api/v1/attendance
// @access  Private/Admin
exports.getAttendances = asyncHandler(async (req, res, next) => {
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields', 'startDate', 'endDate'];
  excludedFields.forEach((field) => delete queryObj[field]);

  // Date range filter
  if (req.query.startDate || req.query.endDate) {
    queryObj.date = {};
    if (req.query.startDate) {
      queryObj.date.$gte = new Date(req.query.startDate);
    }
    if (req.query.endDate) {
      queryObj.date.$lte = new Date(req.query.endDate);
    }
  }

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

  let query = Attendance.find(JSON.parse(queryStr))
    .populate('employee', 'name position avatar department')
    .populate('approvedBy', 'name email');

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-date -checkIn');
  }

  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Attendance.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);
  const attendances = await query;

  const pagination = {};
  if (endIndex < total) pagination.next = { page: page + 1, limit };
  if (startIndex > 0) pagination.prev = { page: page - 1, limit };

  res.status(200).json({
    success: true,
    count: attendances.length,
    total,
    pagination,
    data: attendances,
  });
});

// @desc    Bitta davomatni olish
// @route   GET /api/v1/attendance/:id
// @access  Private
exports.getAttendance = asyncHandler(async (req, res, next) => {
  const attendance = await Attendance.findById(req.params.id)
    .populate('employee', 'name position avatar department email phone')
    .populate('approvedBy', 'name email');

  if (!attendance) {
    return next(new ErrorResponse(`Davomat topilmadi: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: attendance,
  });
});

// @desc    Check-in (Keldi)
// @route   POST /api/v1/attendance/checkin
// @access  Private
exports.checkIn = asyncHandler(async (req, res, next) => {
  const { employeeId, location, notes } = req.body;

  // Check if already checked in today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const existingAttendance = await Attendance.findOne({
    employee: employeeId,
    date: { $gte: today },
  });

  if (existingAttendance) {
    return next(new ErrorResponse('Bugun allaqachon keldi deb belgilangan', 400));
  }

  const attendance = await Attendance.create({
    employee: employeeId,
    date: new Date(),
    checkIn: new Date(),
    location,
    notes,
    ipAddress: req.ip || req.connection.remoteAddress,
    device: req.get('user-agent'),
  });

  await attendance.populate('employee', 'name position avatar');

  res.status(201).json({
    success: true,
    message: 'Muvaffaqiyatli check-in qilindi',
    data: attendance,
  });
});

// @desc    Check-out (Ketdi)
// @route   PUT /api/v1/attendance/checkout/:id
// @access  Private
exports.checkOut = asyncHandler(async (req, res, next) => {
  let attendance = await Attendance.findById(req.params.id);

  if (!attendance) {
    return next(new ErrorResponse(`Davomat topilmadi: ${req.params.id}`, 404));
  }

  if (attendance.checkOut) {
    return next(new ErrorResponse('Allaqachon check-out qilingan', 400));
  }

  attendance.checkOut = new Date();
  if (req.body.notes) {
    attendance.notes = req.body.notes;
  }

  await attendance.save();
  await attendance.populate('employee', 'name position avatar');

  res.status(200).json({
    success: true,
    message: 'Muvaffaqiyatli check-out qilindi',
    data: attendance,
  });
});

// @desc    Davomat yaratish (Admin)
// @route   POST /api/v1/attendance
// @access  Private/Admin
exports.createAttendance = asyncHandler(async (req, res, next) => {
  const attendance = await Attendance.create(req.body);
  await attendance.populate('employee', 'name position avatar');

  res.status(201).json({
    success: true,
    data: attendance,
  });
});

// @desc    Davomatni yangilash
// @route   PUT /api/v1/attendance/:id
// @access  Private/Admin
exports.updateAttendance = asyncHandler(async (req, res, next) => {
  let attendance = await Attendance.findById(req.params.id);

  if (!attendance) {
    return next(new ErrorResponse(`Davomat topilmadi: ${req.params.id}`, 404));
  }

  attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('employee', 'name position avatar');

  res.status(200).json({
    success: true,
    data: attendance,
  });
});

// @desc    Davomatni o'chirish
// @route   DELETE /api/v1/attendance/:id
// @access  Private/Admin
exports.deleteAttendance = asyncHandler(async (req, res, next) => {
  const attendance = await Attendance.findById(req.params.id);

  if (!attendance) {
    return next(new ErrorResponse(`Davomat topilmadi: ${req.params.id}`, 404));
  }

  await attendance.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Davomatni tasdiqlash
// @route   PUT /api/v1/attendance/:id/approve
// @access  Private/Admin
exports.approveAttendance = asyncHandler(async (req, res, next) => {
  const attendance = await Attendance.findById(req.params.id);

  if (!attendance) {
    return next(new ErrorResponse(`Davomat topilmadi: ${req.params.id}`, 404));
  }

  attendance.isApproved = true;
  attendance.approvedBy = req.user.id;
  attendance.approvedAt = Date.now();

  await attendance.save();
  await attendance.populate('employee', 'name position avatar');

  res.status(200).json({
    success: true,
    data: attendance,
  });
});

// @desc    Xodim bo'yicha davomatlar
// @route   GET /api/v1/attendance/employee/:employeeId
// @access  Private
exports.getEmployeeAttendance = asyncHandler(async (req, res, next) => {
  const { employeeId } = req.params;
  const { startDate, endDate } = req.query;

  const query = { employee: employeeId };

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  const attendances = await Attendance.find(query)
    .sort('-date')
    .populate('approvedBy', 'name');

  res.status(200).json({
    success: true,
    count: attendances.length,
    data: attendances,
  });
});

// @desc    Bugungi davomatlar
// @route   GET /api/v1/attendance/today/all
// @access  Private/Admin
exports.getTodayAttendance = asyncHandler(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const attendances = await Attendance.find({
    date: { $gte: today, $lt: tomorrow },
  })
    .populate('employee', 'name position avatar department')
    .sort('checkIn');

  res.status(200).json({
    success: true,
    count: attendances.length,
    data: attendances,
  });
});

// @desc    Davomat statistikasi
// @route   GET /api/v1/attendance/stats/overview
// @access  Private/Admin
exports.getAttendanceStats = asyncHandler(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  const matchStage = {};
  if (startDate || endDate) {
    matchStage.date = {};
    if (startDate) matchStage.date.$gte = new Date(startDate);
    if (endDate) matchStage.date.$lte = new Date(endDate);
  }

  const stats = await Attendance.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgWorkHours: { $avg: '$workHours' },
        totalOvertime: { $sum: '$overtime' },
      },
    },
  ]);

  const totalEmployees = await TeamMember.countDocuments({ isActive: true });
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayPresent = await Attendance.countDocuments({
    date: { $gte: today },
    status: { $in: ['present', 'late'] },
  });

  const lateComers = await Attendance.find({
    date: { $gte: today },
    status: 'late',
  })
    .populate('employee', 'name position avatar')
    .limit(10);

  res.status(200).json({
    success: true,
    data: {
      totalEmployees,
      todayPresent,
      todayAbsent: totalEmployees - todayPresent,
      byStatus: stats,
      lateComers,
    },
  });
});

// @desc    Oylik hisobot
// @route   GET /api/v1/attendance/report/monthly
// @access  Private/Admin
exports.getMonthlyReport = asyncHandler(async (req, res, next) => {
  const { year, month } = req.query;
  
  const startDate = new Date(year || new Date().getFullYear(), (month || new Date().getMonth()) - 1, 1);
  const endDate = new Date(year || new Date().getFullYear(), month || new Date().getMonth(), 0);

  const report = await Attendance.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: '$employee',
        totalDays: { $sum: 1 },
        presentDays: {
          $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] },
        },
        lateDays: {
          $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] },
        },
        absentDays: {
          $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] },
        },
        totalWorkHours: { $sum: '$workHours' },
        totalOvertime: { $sum: '$overtime' },
        avgLateMinutes: { $avg: '$lateMinutes' },
      },
    },
    {
      $lookup: {
        from: 'teammembers',
        localField: '_id',
        foreignField: '_id',
        as: 'employee',
      },
    },
    {
      $unwind: '$employee',
    },
    {
      $project: {
        employeeName: '$employee.name',
        employeePosition: '$employee.position',
        totalDays: 1,
        presentDays: 1,
        lateDays: 1,
        absentDays: 1,
        totalWorkHours: { $round: ['$totalWorkHours', 2] },
        totalOvertime: { $round: ['$totalOvertime', 2] },
        avgLateMinutes: { $round: ['$avgLateMinutes', 0] },
        attendanceRate: {
          $round: [
            { $multiply: [{ $divide: ['$presentDays', '$totalDays'] }, 100] },
            2,
          ],
        },
      },
    },
    {
      $sort: { employeeName: 1 },
    },
  ]);

  res.status(200).json({
    success: true,
    period: {
      start: startDate,
      end: endDate,
    },
    count: report.length,
    data: report,
  });
});
