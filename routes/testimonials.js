const express = require('express')
const {
	getTestimonials,
	getTestimonial,
	createTestimonial,
	updateTestimonial,
	deleteTestimonial,
	getFeaturedTestimonials,
	getTestimonialsByRating,
	getTestimonialStats,
} = require('../controllers/testimonialController')

const router = express.Router()

const { protect, authorize } = require('../middleware/auth')

/**
 * @swagger
 * tags:
 *   name: Testimonials
 *   description: Mijozlar sharhlari
 */

/**
 * @swagger
 * /testimonials:
 *   get:
 *     summary: Barcha mijoz sharhlarini olish
 *     tags: [Testimonials]
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
 *                   clientName:
 *                     type: string
 *                     example: John Doe
 *                   company:
 *                     type: string
 *                   position:
 *                     type: string
 *                   rating:
 *                     type: integer
 *                     minimum: 1
 *                     maximum: 5
 *                   message:
 *                     type: string
 *                   photo:
 *                     type: string
 *                   isFeatured:
 *                     type: boolean
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /testimonials:
 *   post:
 *     summary: Yangi mijoz sharhi qo'shish
 *     tags: [Testimonials]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientName
 *               - rating
 *               - message
 *             properties:
 *               clientName:
 *                 type: string
 *               company:
 *                 type: string
 *               position:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               message:
 *                 type: string
 *               photo:
 *                 type: string
 *               isFeatured:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Sharh muvaffaqiyatli yaratildi
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /testimonials/featured/list:
 *   get:
 *     summary: Tanlangan (featured) mijoz sharhlarini olish
 *     tags: [Testimonials]
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
 *                   clientName:
 *                     type: string
 *                   company:
 *                     type: string
 *                   rating:
 *                     type: integer
 *                   message:
 *                     type: string
 *                   photo:
 *                     type: string
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /testimonials/rating/{rating}:
 *   get:
 *     summary: Reyting bo'yicha mijoz sharhlarini olish
 *     tags: [Testimonials]
 *     parameters:
 *       - in: path
 *         name: rating
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         required: true
 *         description: Reyting (1-5)
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
 *                   clientName:
 *                     type: string
 *                   rating:
 *                     type: integer
 *                   message:
 *                     type: string
 *       404:
 *         description: Ushbu reytingda sharhlar topilmadi
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /testimonials/stats/overview:
 *   get:
 *     summary: Mijoz sharhlari bo'yicha umumiy statistika
 *     tags: [Testimonials]
 *     responses:
 *       200:
 *         description: Statistika ma'lumotlari
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalTestimonials:
 *                   type: integer
 *                 averageRating:
 *                   type: number
 *                   format: float
 *                 ratingDistribution:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *                 featuredCount:
 *                   type: integer
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /testimonials/{id}:
 *   get:
 *     summary: Bitta mijoz sharhini ID bo'yicha olish
 *     tags: [Testimonials]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Sharh ID si
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli
 *       404:
 *         description: Sharh topilmadi
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /testimonials/{id}:
 *   put:
 *     summary: Mijoz sharhini yangilash
 *     tags: [Testimonials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Sharh ID si
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientName:
 *                 type: string
 *               company:
 *                 type: string
 *               position:
 *                 type: string
 *               rating:
 *                 type: integer
 *               message:
 *                 type: string
 *               photo:
 *                 type: string
 *               isFeatured:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Sharh muvaffaqiyatli yangilandi
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       404:
 *         description: Sharh topilmadi
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /testimonials/{id}:
 *   delete:
 *     summary: Mijoz sharhini o'chirish
 *     tags: [Testimonials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Sharh ID si
 *     responses:
 *       200:
 *         description: Sharh muvaffaqiyatli o'chirildi
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       404:
 *         description: Sharh topilmadi
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

router
	.route('/')
	.get(getTestimonials)
	.post(protect, authorize('admin', 'super-admin'), createTestimonial)

router.route('/featured/list').get(getFeaturedTestimonials)

router.route('/rating/:rating').get(getTestimonialsByRating)

router.route('/stats/overview').get(getTestimonialStats)

router
	.route('/:id')
	.get(getTestimonial)
	.put(protect, authorize('admin', 'super-admin'), updateTestimonial)
	.delete(protect, authorize('admin', 'super-admin'), deleteTestimonial)

module.exports = router
