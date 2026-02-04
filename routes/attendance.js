const express = require('express')
const {
	getAttendances,
	getAttendance,
	checkIn,
	checkOut,
	createAttendance,
	updateAttendance,
	deleteAttendance,
	approveAttendance,
	getEmployeeAttendance,
	getTodayAttendance,
	getAttendanceStats,
	getMonthlyReport,
} = require('../controllers/attendanceController')

const router = express.Router()

const { protect, authorize } = require('../middleware/auth')

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Xodimlar davomat tizimi
 */

/**
 * @swagger
 * /attendance/checkin:
 *   post:
 *     summary: Xodimning ish kunini boshlash (check-in)
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Check-in muvaffaqiyatli amalga oshirildi
 *       400:
 *         description: Allaqaqon check-in qilingan yoki boshqa xato
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /attendance/checkout/{id}:
 *   put:
 *     summary: Xodimning ish kunini tugatish (check-out)
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Davomat yozuvi ID si
 *     responses:
 *       200:
 *         description: Check-out muvaffaqiyatli amalga oshirildi
 *       400:
 *         description: Check-out vaqti noto'g'ri yoki boshqa xato
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       404:
 *         description: Davomat yozuvi topilmadi
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /attendance:
 *   get:
 *     summary: Barcha davomat yozuvlarini olish (admin uchun)
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attendance'
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /attendance:
 *   post:
 *     summary: Yangi davomat yozuvi qo'shish (admin uchun)
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Attendance'
 *     responses:
 *       201:
 *         description: Davomat yozuvi muvaffaqiyatli yaratildi
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /attendance/today/all:
 *   get:
 *     summary: Bugungi kun davomat holatini olish (admin uchun)
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bugungi davomat ma'lumotlari
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /attendance/stats/overview:
 *   get:
 *     summary: Umumiy davomat statistikasi (admin uchun)
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistika ma'lumotlari
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /attendance/report/monthly:
 *   get:
 *     summary: Oylik davomat hisoboti (admin uchun)
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Oylik hisobot
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /attendance/employee/{employeeId}:
 *   get:
 *     summary: Bitta xodimning davomat tarixi (admin uchun)
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         schema:
 *           type: string
 *         required: true
 *         description: Xodim ID si
 *     responses:
 *       200:
 *         description: Xodim davomat ma'lumotlari
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       404:
 *         description: Xodim topilmadi
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /attendance/{id}:
 *   get:
 *     summary: Bitta davomat yozuvini olish (admin uchun)
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Davomat yozuvi ID si
 *     responses:
 *       200:
 *         description: Davomat yozuvi
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       404:
 *         description: Yozuv topilmadi
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /attendance/{id}:
 *   put:
 *     summary: Davomat yozuvini yangilash (admin uchun)
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Davomat yozuvi ID si
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Attendance'
 *     responses:
 *       200:
 *         description: Yozuv muvaffaqiyatli yangilandi
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       404:
 *         description: Yozuv topilmadi
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /attendance/{id}:
 *   delete:
 *     summary: Davomat yozuvini o'chirish (admin uchun)
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Davomat yozuvi ID si
 *     responses:
 *       200:
 *         description: Yozuv muvaffaqiyatli o'chirildi
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       404:
 *         description: Yozuv topilmadi
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /attendance/{id}/approve:
 *   put:
 *     summary: Davomat yozuvini tasdiqlash (admin uchun)
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Davomat yozuvi ID si
 *     responses:
 *       200:
 *         description: Yozuv tasdiqlandi
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       404:
 *         description: Yozuv topilmadi
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

// Public/Employee routes
router.post('/checkin', protect, checkIn)
router.put('/checkout/:id', protect, checkOut)

// Admin routes
router.use(protect)
router.use(authorize('admin', 'super-admin'))

router.route('/').get(getAttendances).post(createAttendance)

router.route('/today/all').get(getTodayAttendance)

router.route('/stats/overview').get(getAttendanceStats)

router.route('/report/monthly').get(getMonthlyReport)

router.route('/employee/:employeeId').get(getEmployeeAttendance)

router
	.route('/:id')
	.get(getAttendance)
	.put(updateAttendance)
	.delete(deleteAttendance)

router.route('/:id/approve').put(approveAttendance)

module.exports = router
