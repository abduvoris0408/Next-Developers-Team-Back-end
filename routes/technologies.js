const express = require('express')
const {
	getTechnologies,
	getTechnology,
	createTechnology,
	updateTechnology,
	deleteTechnology,
	getTechnologiesByCategory,
	getFeaturedTechnologies,
} = require('../controllers/technologyController')

const router = express.Router()

const { protect, authorize } = require('../middleware/auth')

/**
 * @swagger
 * tags:
 *   name: Technologies
 *   description: Ishlatilgan texnologiyalar
 */

/**
 * @swagger
 * /technologies:
 *   get:
 *     summary: Barcha texnologiyalarni olish
 *     tags: [Technologies]
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
 *                     example: React.js
 *                   slug:
 *                     type: string
 *                   category:
 *                     type: string
 *                     example: Frontend
 *                   icon:
 *                     type: string
 *                   level:
 *                     type: string
 *                     enum: [beginner, intermediate, advanced]
 *                   description:
 *                     type: string
 *                   isFeatured:
 *                     type: boolean
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /technologies:
 *   post:
 *     summary: Yangi texnologiya qo'shish
 *     tags: [Technologies]
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
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               icon:
 *                 type: string
 *               level:
 *                 type: string
 *               description:
 *                 type: string
 *               isFeatured:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Texnologiya muvaffaqiyatli yaratildi
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /technologies/featured/list:
 *   get:
 *     summary: Tanlangan (featured) texnologiyalarni olish
 *     tags: [Technologies]
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
 *                   icon:
 *                     type: string
 *                   category:
 *                     type: string
 *                   level:
 *                     type: string
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /technologies/category/{category}:
 *   get:
 *     summary: Kategoriya bo'yicha texnologiyalarni olish
 *     tags: [Technologies]
 *     parameters:
 *       - in: path
 *         name: category
 *         schema:
 *           type: string
 *         required: true
 *         description: Texnologiya kategoriyasi (masalan, frontend, backend, database)
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
 *                   icon:
 *                     type: string
 *                   level:
 *                     type: string
 *       404:
 *         description: Ushbu kategoriyada texnologiya topilmadi
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /technologies/{idOrSlug}:
 *   get:
 *     summary: Bitta texnologiyani ID yoki slug bo'yicha olish
 *     tags: [Technologies]
 *     parameters:
 *       - in: path
 *         name: idOrSlug
 *         schema:
 *           type: string
 *         required: true
 *         description: Texnologiya ID si yoki slug
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli
 *       404:
 *         description: Texnologiya topilmadi
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /technologies/{idOrSlug}:
 *   put:
 *     summary: Texnologiyani yangilash
 *     tags: [Technologies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idOrSlug
 *         schema:
 *           type: string
 *         required: true
 *         description: Texnologiya ID si yoki slug
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               icon:
 *                 type: string
 *               level:
 *                 type: string
 *               description:
 *                 type: string
 *               isFeatured:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Texnologiya muvaffaqiyatli yangilandi
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       404:
 *         description: Texnologiya topilmadi
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /technologies/{idOrSlug}:
 *   delete:
 *     summary: Texnologiyani o'chirish
 *     tags: [Technologies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idOrSlug
 *         schema:
 *           type: string
 *         required: true
 *         description: Texnologiya ID si yoki slug
 *     responses:
 *       200:
 *         description: Texnologiya muvaffaqiyatli o'chirildi
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       404:
 *         description: Texnologiya topilmadi
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

router
	.route('/')
	.get(getTechnologies)
	.post(protect, authorize('admin', 'super-admin'), createTechnology)

router.route('/featured/list').get(getFeaturedTechnologies)

router.route('/category/:category').get(getTechnologiesByCategory)

router
	.route('/:idOrSlug')
	.get(getTechnology)
	.put(protect, authorize('admin', 'super-admin'), updateTechnology)
	.delete(protect, authorize('admin', 'super-admin'), deleteTechnology)

module.exports = router
