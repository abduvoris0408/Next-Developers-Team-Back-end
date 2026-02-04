const express = require('express')
const {
	getAwards,
	getAward,
	createAward,
	updateAward,
	deleteAward,
	getAwardsByYear,
	getAwardStats,
} = require('../controllers/awardController')

const router = express.Router()

const { protect, authorize } = require('../middleware/auth')

/**
 * @swagger
 * tags:
 *   name: Awards
 *   description: Yutuqlar va mukofotlar
 */

/**
 * @swagger
 * /awards:
 *   get:
 *     summary: Barcha yutuqlarni olish
 *     tags: [Awards]
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                     example: Best Startup 2023
 *                   year:
 *                     type: integer
 *                     example: 2023
 *                   description:
 *                     type: string
 *                   image:
 *                     type: string
 *                   organization:
 *                     type: string
 *                   isActive:
 *                     type: boolean
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /awards:
 *   post:
 *     summary: Yangi yutuq qo'shish
 *     tags: [Awards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - year
 *             properties:
 *               title:
 *                 type: string
 *               year:
 *                 type: integer
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *               organization:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Yutuq muvaffaqiyatli yaratildi
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /awards/year/{year}:
 *   get:
 *     summary: Berilgan yil bo'yicha yutuqlarni olish
 *     tags: [Awards]
 *     parameters:
 *       - in: path
 *         name: year
 *         schema:
 *           type: integer
 *         required: true
 *         description: Yil (masalan, 2023)
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   image:
 *                     type: string
 *       404:
 *         description: Ushbu yilda yutuqlar topilmadi
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /awards/stats/overview:
 *   get:
 *     summary: Yutuqlar bo'yicha umumiy statistika
 *     tags: [Awards]
 *     responses:
 *       200:
 *         description: Statistika ma'lumotlari
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalAwards:
 *                   type: integer
 *                 awardsByYear:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *                 latestYear:
 *                   type: integer
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /awards/{id}:
 *   get:
 *     summary: Bitta yutuqni ID bo'yicha olish
 *     tags: [Awards]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Yutuq ID si
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli
 *       404:
 *         description: Yutuq topilmadi
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /awards/{id}:
 *   put:
 *     summary: Yutuqni yangilash
 *     tags: [Awards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Yutuq ID si
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               year:
 *                 type: integer
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *               organization:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Yutuq muvaffaqiyatli yangilandi
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       404:
 *         description: Yutuq topilmadi
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /awards/{id}:
 *   delete:
 *     summary: Yutuqni o'chirish
 *     tags: [Awards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Yutuq ID si
 *     responses:
 *       200:
 *         description: Yutuq muvaffaqiyatli o'chirildi
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       404:
 *         description: Yutuq topilmadi
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

router
	.route('/')
	.get(getAwards)
	.post(protect, authorize('admin', 'super-admin'), createAward)

router.route('/year/:year').get(getAwardsByYear)

router.route('/stats/overview').get(getAwardStats)

router
	.route('/:id')
	.get(getAward)
	.put(protect, authorize('admin', 'super-admin'), updateAward)
	.delete(protect, authorize('admin', 'super-admin'), deleteAward)

module.exports = router
