const express = require('express')
const {
	getDashboardOverview,
	getProductsDashboard,
	getTeamDashboard,
	getAttendanceDashboard,
	getContactsDashboard,
	getAnalytics,
} = require('../controllers/dashboardController')

const router = express.Router()

const { protect, authorize } = require('../middleware/auth')

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard statistikasi va analytics
 */

/**
 * @swagger
 * /dashboard/overview:
 *   get:
 *     summary: Umumiy dashboard ko'rinishi (admin uchun)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Umumiy statistika
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalProducts:
 *                   type: integer
 *                 totalTeamMembers:
 *                   type: integer
 *                 totalContacts:
 *                   type: integer
 *                 todayAttendance:
 *                   type: integer
 *                 pendingContacts:
 *                   type: integer
 *                 recentAwards:
 *                   type: integer
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /dashboard/products:
 *   get:
 *     summary: Mahsulotlar bo'yicha dashboard statistikasi
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mahsulotlar statistikasi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalProducts:
 *                   type: integer
 *                 activeProducts:
 *                   type: integer
 *                 byCategory:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /dashboard/team:
 *   get:
 *     summary: Jamoa a'zolari bo'yicha dashboard statistikasi
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Jamoa statistikasi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalMembers:
 *                   type: integer
 *                 byRole:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *                 newMembersThisMonth:
 *                   type: integer
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /dashboard/attendance:
 *   get:
 *     summary: Davomat bo'yicha dashboard statistikasi
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Davomat statistikasi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todayPresent:
 *                   type: integer
 *                 todayAbsent:
 *                   type: integer
 *                 monthlyAverage:
 *                   type: number
 *                   format: float
 *                 lateArrivals:
 *                   type: integer
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /dashboard/contacts:
 *   get:
 *     summary: Aloqa so'rovlari bo'yicha dashboard statistikasi
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Aloqa statistikasi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalContacts:
 *                   type: integer
 *                 newContacts:
 *                   type: integer
 *                 inProgress:
 *                   type: integer
 *                 resolved:
 *                   type: integer
 *                 byMonth:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /dashboard/analytics:
 *   get:
 *     summary: Umumiy analitika va grafik ma'lumotlari
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analitika ma'lumotlari (grafiklar uchun)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 monthlyGrowth:
 *                   type: array
 *                   items:
 *                     type: object
 *                 trafficSources:
 *                   type: object
 *                 performanceMetrics:
 *                   type: object
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

// All dashboard routes are protected and admin only
router.use(protect)
router.use(authorize('admin', 'super-admin'))

router.get('/overview', getDashboardOverview)
router.get('/products', getProductsDashboard)
router.get('/team', getTeamDashboard)
router.get('/attendance', getAttendanceDashboard)
router.get('/contacts', getContactsDashboard)
router.get('/analytics', getAnalytics)

module.exports = router
