const Product = require('../models/Product');
const TeamMember = require('../models/TeamMember');
const Contact = require('../models/Contact');
const Testimonial = require('../models/Testimonial');
const Attendance = require('../models/Attendance');
const Award = require('../models/Award');
const Technology = require('../models/Technology');
const Feature = require('../models/Feature');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Dashboard overview statistikasi
// @route   GET /api/v1/dashboard/overview
// @access  Private/Admin
exports.getDashboardOverview = asyncHandler(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  // Products Statistics
  const totalProducts = await Product.countDocuments();
  const activeProducts = await Product.countDocuments({ isActive: true });
  const featuredProducts = await Product.countDocuments({ isFeatured: true });

  // Team Statistics
  const totalTeam = await TeamMember.countDocuments();
  const activeTeam = await TeamMember.countDocuments({ isActive: true });
  
  // Today's Attendance
  const todayAttendance = await Attendance.countDocuments({
    date: { $gte: today },
    status: { $in: ['present', 'late'] },
  });
  const todayAbsent = activeTeam - todayAttendance;
  const todayLate = await Attendance.countDocuments({
    date: { $gte: today },
    status: 'late',
  });

  // Contact Statistics
  const totalContacts = await Contact.countDocuments();
  const newContacts = await Contact.countDocuments({ status: 'new' });
  const highPriorityContacts = await Contact.countDocuments({
    priority: 'high',
    status: { $ne: 'closed' },
  });

  // Testimonials
  const totalTestimonials = await Testimonial.countDocuments({ isActive: true });
  const avgRating = await Testimonial.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: null, avgRating: { $avg: '$rating' } } },
  ]);

  // Technologies
  const totalTechnologies = await Technology.countDocuments({ isActive: true });

  // Awards
  const totalAwards = await Award.countDocuments({ isActive: true });

  // Recent Activities
  const recentContacts = await Contact.find()
    .sort('-createdAt')
    .limit(5)
    .select('name email subject status priority createdAt');

  const recentProducts = await Product.find({ isActive: true })
    .sort('-createdAt')
    .limit(5)
    .select('name slug mainImage category status createdAt');

  // Monthly Trends
  const monthlyProducts = await Product.aggregate([
    {
      $match: {
        createdAt: { $gte: lastMonth },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const monthlyContacts = await Contact.aggregate([
    {
      $match: {
        createdAt: { $gte: lastMonth },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  res.status(200).json({
    success: true,
    data: {
      overview: {
        products: {
          total: totalProducts,
          active: activeProducts,
          featured: featuredProducts,
        },
        team: {
          total: totalTeam,
          active: activeTeam,
          present: todayAttendance,
          absent: todayAbsent,
          late: todayLate,
        },
        contacts: {
          total: totalContacts,
          new: newContacts,
          highPriority: highPriorityContacts,
        },
        testimonials: {
          total: totalTestimonials,
          avgRating: avgRating[0]?.avgRating || 0,
        },
        technologies: totalTechnologies,
        awards: totalAwards,
      },
      recentActivities: {
        contacts: recentContacts,
        products: recentProducts,
      },
      trends: {
        products: monthlyProducts,
        contacts: monthlyContacts,
      },
    },
  });
});

// @desc    Products Dashboard
// @route   GET /api/v1/dashboard/products
// @access  Private/Admin
exports.getProductsDashboard = asyncHandler(async (req, res, next) => {
  // Category wise distribution
  const categoryStats = await Product.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        avgRating: { $avg: '$rating.average' },
        totalDownloads: { $sum: '$downloads' },
      },
    },
    { $sort: { count: -1 } },
  ]);

  // Status wise distribution
  const statusStats = await Product.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  // Top rated products
  const topRated = await Product.find({ isActive: true })
    .sort('-rating.average')
    .limit(5)
    .select('name slug mainImage rating category');

  // Most downloaded
  const mostDownloaded = await Product.find({ isActive: true })
    .sort('-downloads')
    .limit(5)
    .select('name slug mainImage downloads category');

  res.status(200).json({
    success: true,
    data: {
      categoryStats,
      statusStats,
      topRated,
      mostDownloaded,
    },
  });
});

// @desc    Team Dashboard
// @route   GET /api/v1/dashboard/team
// @access  Private/Admin
exports.getTeamDashboard = asyncHandler(async (req, res, next) => {
  // Department wise distribution
  const departmentStats = await TeamMember.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$department',
        count: { $sum: 1 },
        avgExperience: { $avg: '$experience' },
        totalProjects: { $sum: '$projectsCompleted' },
      },
    },
    { $sort: { count: -1 } },
  ]);

  // Experience distribution
  const experienceStats = await TeamMember.aggregate([
    { $match: { isActive: true } },
    {
      $bucket: {
        groupBy: '$experience',
        boundaries: [0, 2, 5, 8, 100],
        default: 'Other',
        output: {
          count: { $sum: 1 },
          members: { $push: '$name' },
        },
      },
    },
  ]);

  // Top performers
  const topPerformers = await TeamMember.find({ isActive: true })
    .sort('-projectsCompleted')
    .limit(5)
    .select('name position avatar projectsCompleted experience');

  // Recent joins
  const recentJoins = await TeamMember.find({ isActive: true })
    .sort('-joinDate')
    .limit(5)
    .select('name position avatar joinDate');

  res.status(200).json({
    success: true,
    data: {
      departmentStats,
      experienceStats,
      topPerformers,
      recentJoins,
    },
  });
});

// @desc    Attendance Dashboard
// @route   GET /api/v1/dashboard/attendance
// @access  Private/Admin
exports.getAttendanceDashboard = asyncHandler(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const matchStage = {};
  if (startDate || endDate) {
    matchStage.date = {};
    if (startDate) matchStage.date.$gte = new Date(startDate);
    if (endDate) matchStage.date.$lte = new Date(endDate);
  } else {
    // Default: last 30 days
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    matchStage.date = { $gte: thirtyDaysAgo };
  }

  // Status wise distribution
  const statusStats = await Attendance.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgWorkHours: { $avg: '$workHours' },
      },
    },
  ]);

  // Daily attendance trend
  const dailyTrend = await Attendance.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
          day: { $dayOfMonth: '$date' },
        },
        present: {
          $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] },
        },
        late: {
          $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] },
        },
        absent: {
          $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] },
        },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
  ]);

  // Top late comers
  const lateComers = await Attendance.aggregate([
    { $match: { ...matchStage, status: 'late' } },
    {
      $group: {
        _id: '$employee',
        lateCount: { $sum: 1 },
        avgLateMinutes: { $avg: '$lateMinutes' },
      },
    },
    { $sort: { lateCount: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'teammembers',
        localField: '_id',
        foreignField: '_id',
        as: 'employee',
      },
    },
    { $unwind: '$employee' },
  ]);

  // Overtime leaders
  const overtimeLeaders = await Attendance.aggregate([
    { $match: { ...matchStage, overtime: { $gt: 0 } } },
    {
      $group: {
        _id: '$employee',
        totalOvertime: { $sum: '$overtime' },
        overtimeCount: { $sum: 1 },
      },
    },
    { $sort: { totalOvertime: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'teammembers',
        localField: '_id',
        foreignField: '_id',
        as: 'employee',
      },
    },
    { $unwind: '$employee' },
  ]);

  // Today's status
  const todayStats = await Attendance.aggregate([
    { $match: { date: { $gte: today } } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      statusStats,
      dailyTrend,
      lateComers,
      overtimeLeaders,
      todayStats,
    },
  });
});

// @desc    Contacts Dashboard
// @route   GET /api/v1/dashboard/contacts
// @access  Private/Admin
exports.getContactsDashboard = asyncHandler(async (req, res, next) => {
  // Status wise
  const statusStats = await Contact.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  // Priority wise
  const priorityStats = await Contact.aggregate([
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 },
      },
    },
  ]);

  // Service wise
  const serviceStats = await Contact.aggregate([
    {
      $group: {
        _id: '$service',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  // Response time (average time to first reply)
  const avgResponseTime = await Contact.aggregate([
    {
      $match: {
        status: { $in: ['replied', 'closed'] },
      },
    },
    {
      $project: {
        responseTime: {
          $subtract: ['$updatedAt', '$createdAt'],
        },
      },
    },
    {
      $group: {
        _id: null,
        avgResponseTime: { $avg: '$responseTime' },
      },
    },
  ]);

  // Recent high priority
  const highPriority = await Contact.find({
    priority: 'high',
    status: { $ne: 'closed' },
  })
    .sort('-createdAt')
    .limit(10)
    .select('name email subject status priority createdAt');

  res.status(200).json({
    success: true,
    data: {
      statusStats,
      priorityStats,
      serviceStats,
      avgResponseTime: avgResponseTime[0]?.avgResponseTime || 0,
      highPriority,
    },
  });
});

// @desc    Analytics - Full Report
// @route   GET /api/v1/dashboard/analytics
// @access  Private/Admin
exports.getAnalytics = asyncHandler(async (req, res, next) => {
  const { period = '30' } = req.query; // days

  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - parseInt(period));

  // Growth metrics
  const productsGrowth = await Product.aggregate([
    {
      $facet: {
        total: [{ $count: 'count' }],
        recent: [
          { $match: { createdAt: { $gte: daysAgo } } },
          { $count: 'count' },
        ],
      },
    },
  ]);

  const contactsGrowth = await Contact.aggregate([
    {
      $facet: {
        total: [{ $count: 'count' }],
        recent: [
          { $match: { createdAt: { $gte: daysAgo } } },
          { $count: 'count' },
        ],
      },
    },
  ]);

  const teamGrowth = await TeamMember.aggregate([
    {
      $facet: {
        total: [{ $count: 'count' }],
        recent: [
          { $match: { joinDate: { $gte: daysAgo } } },
          { $count: 'count' },
        ],
      },
    },
  ]);

  res.status(200).json({
    success: true,
    period: `Last ${period} days`,
    data: {
      products: {
        total: productsGrowth[0]?.total[0]?.count || 0,
        growth: productsGrowth[0]?.recent[0]?.count || 0,
      },
      contacts: {
        total: contactsGrowth[0]?.total[0]?.count || 0,
        growth: contactsGrowth[0]?.recent[0]?.count || 0,
      },
      team: {
        total: teamGrowth[0]?.total[0]?.count || 0,
        growth: teamGrowth[0]?.recent[0]?.count || 0,
      },
    },
  });
});
