const express = require('express')
const {
	getProducts,
	getProduct,
	createProduct,
	updateProduct,
	deleteProduct,
	getFeaturedProducts,
	getProductsByCategory,
	getProductStats,
} = require('../controllers/productController')

const router = express.Router()

const { protect, authorize } = require('../middleware/auth')

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Mahsulotlar va loyihalar
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Barcha mahsulotlarni olish
 *     tags: [Products]
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
 *                     example: Company Website
 *                   slug:
 *                     type: string
 *                   description:
 *                     type: string
 *                   category:
 *                     type: string
 *                   images:
 *                     type: array
 *                     items:
 *                       type: string
 *                   technologies:
 *                     type: array
 *                     items:
 *                       type: string
 *                   isFeatured:
 *                     type: boolean
 *                   liveUrl:
 *                     type: string
 *                   sourceUrl:
 *                     type: string
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Yangi mahsulot/loyiha qo'shish
 *     tags: [Products]
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
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: string
 *               isFeatured:
 *                 type: boolean
 *                 default: false
 *               liveUrl:
 *                 type: string
 *               sourceUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Mahsulot muvaffaqiyatli yaratildi
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /products/featured/list:
 *   get:
 *     summary: Tanlangan (featured) mahsulotlarni olish
 *     tags: [Products]
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
 *                   images:
 *                     type: array
 *                     items:
 *                       type: string
 *                   liveUrl:
 *                     type: string
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /products/category/{category}:
 *   get:
 *     summary: Kategoriya bo'yicha mahsulotlarni olish
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: category
 *         schema:
 *           type: string
 *         required: true
 *         description: Mahsulot kategoriyasi (masalan, web, mobile)
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
 *                   images:
 *                     type: array
 *                     items:
 *                       type: string
 *       404:
 *         description: Ushbu kategoriyada mahsulot topilmadi
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /products/stats/overview:
 *   get:
 *     summary: Mahsulotlar bo'yicha umumiy statistika (admin uchun)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistika ma'lumotlari
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalProducts:
 *                   type: integer
 *                 featuredCount:
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
 * /products/{idOrSlug}:
 *   get:
 *     summary: Bitta mahsulotni ID yoki slug bo'yicha olish
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: idOrSlug
 *         schema:
 *           type: string
 *         required: true
 *         description: Mahsulot ID si yoki slug
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli
 *       404:
 *         description: Mahsulot topilmadi
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /products/{idOrSlug}:
 *   put:
 *     summary: Mahsulotni yangilash
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idOrSlug
 *         schema:
 *           type: string
 *         required: true
 *         description: Mahsulot ID si yoki slug
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
 *               category:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: string
 *               isFeatured:
 *                 type: boolean
 *               liveUrl:
 *                 type: string
 *               sourceUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mahsulot muvaffaqiyatli yangilandi
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       404:
 *         description: Mahsulot topilmadi
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /products/{idOrSlug}:
 *   delete:
 *     summary: Mahsulotni o'chirish
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idOrSlug
 *         schema:
 *           type: string
 *         required: true
 *         description: Mahsulot ID si yoki slug
 *     responses:
 *       200:
 *         description: Mahsulot muvaffaqiyatli o'chirildi
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       404:
 *         description: Mahsulot topilmadi
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

router
	.route('/')
	.get(getProducts)
	.post(protect, authorize('admin', 'super-admin'), createProduct)

router.route('/featured/list').get(getFeaturedProducts)

router.route('/category/:category').get(getProductsByCategory)

router
	.route('/stats/overview')
	.get(protect, authorize('admin', 'super-admin'), getProductStats)

router
	.route('/:idOrSlug')
	.get(getProduct)
	.put(protect, authorize('admin', 'super-admin'), updateProduct)
	.delete(protect, authorize('admin', 'super-admin'), deleteProduct)

module.exports = router
