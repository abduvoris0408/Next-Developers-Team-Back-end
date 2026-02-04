const express = require('express')
const {
	getFeatures,
	getFeature,
	createFeature,
	updateFeature,
	deleteFeature,
	getActiveFeatures,
} = require('../controllers/featureController')

const router = express.Router()

const { protect, authorize } = require('../middleware/auth')

/**
 * @swagger
 * tags:
 *   name: Features
 *   description: Kompaniya xizmatlari boshqaruvi
 */

/**
 * @swagger
 * /features:
 *   get:
 *     summary: Barcha xizmatlarni olish
 *     tags: [Features]
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
 *                     example: Web Development
 *                   description:
 *                     type: string
 *                   icon:
 *                     type: string
 *                   isActive:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /features:
 *   post:
 *     summary: Yangi xizmat qo'shish
 *     tags: [Features]
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
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Xizmat muvaffaqiyatli yaratildi
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /features/active:
 *   get:
 *     summary: Faqat faol xizmatlarni olish
 *     tags: [Features]
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
 *                   icon:
 *                     type: string
 *                   isActive:
 *                     type: boolean
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /features/{id}:
 *   get:
 *     summary: Bitta xizmatni ID bo'yicha olish
 *     tags: [Features]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Xizmat ID si
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli
 *       404:
 *         description: Xizmat topilmadi
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /features/{id}:
 *   put:
 *     summary: Xizmatni yangilash
 *     tags: [Features]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Xizmat ID si
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Xizmat muvaffaqiyatli yangilandi
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       404:
 *         description: Xizmat topilmadi
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /features/{id}:
 *   delete:
 *     summary: Xizmatni o'chirish
 *     tags: [Features]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Xizmat ID si
 *     responses:
 *       200:
 *         description: Xizmat muvaffaqiyatli o'chirildi
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       404:
 *         description: Xizmat topilmadi
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

router
	.route('/')
	.get(getFeatures)
	.post(protect, authorize('admin', 'super-admin'), createFeature)

router.route('/active').get(getActiveFeatures)

router
	.route('/:id')
	.get(getFeature)
	.put(protect, authorize('admin', 'super-admin'), updateFeature)
	.delete(protect, authorize('admin', 'super-admin'), deleteFeature)

module.exports = router
