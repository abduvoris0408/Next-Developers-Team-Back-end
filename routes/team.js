const express = require('express')
const {
	getTeamMembers,
	getTeamMember,
	createTeamMember,
	updateTeamMember,
	deleteTeamMember,
	getFeaturedTeamMembers,
	getTeamByDepartment,
} = require('../controllers/teamController')

const router = express.Router()

const { protect, authorize } = require('../middleware/auth')

/**
 * @swagger
 * tags:
 *   name: Team
 *   description: Jamoa a'zolari (Developers)
 */

/**
 * @swagger
 * /team:
 *   get:
 *     summary: Barcha jamoa a'zolarini olish
 *     tags: [Team]
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
 *                   name:
 *                     type: string
 *                     example: John Doe
 *                   position:
 *                     type: string
 *                     example: Senior Developer
 *                   department:
 *                     type: string
 *                   photo:
 *                     type: string
 *                   bio:
 *                     type: string
 *                   social:
 *                     type: object
 *                     properties:
 *                       linkedin:
 *                         type: string
 *                       github:
 *                         type: string
 *                       twitter:
 *                         type: string
 *                   isFeatured:
 *                     type: boolean
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /team:
 *   post:
 *     summary: Yangi jamoa a'zosini qo'shish
 *     tags: [Team]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - position
 *             properties:
 *               name:
 *                 type: string
 *               position:
 *                 type: string
 *               department:
 *                 type: string
 *               photo:
 *                 type: string
 *               bio:
 *                 type: string
 *               social:
 *                 type: object
 *                 properties:
 *                   linkedin:
 *                     type: string
 *                   github:
 *                     type: string
 *                   twitter:
 *                     type: string
 *               isFeatured:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Jamoa a'zosi muvaffaqiyatli yaratildi
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /team/featured/list:
 *   get:
 *     summary: Tanlangan (featured) jamoa a'zolarini olish
 *     tags: [Team]
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
 *                   name:
 *                     type: string
 *                   position:
 *                     type: string
 *                   photo:
 *                     type: string
 *                   bio:
 *                     type: string
 *                   social:
 *                     type: object
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /team/department/{department}:
 *   get:
 *     summary: Departament bo'yicha jamoa a'zolarini olish
 *     tags: [Team]
 *     parameters:
 *       - in: path
 *         name: department
 *         schema:
 *           type: string
 *         required: true
 *         description: Departament nomi (masalan, backend, frontend, design)
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
 *                   name:
 *                     type: string
 *                   position:
 *                     type: string
 *                   photo:
 *                     type: string
 *       404:
 *         description: Ushbu departamentda a'zolar topilmadi
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /team/{id}:
 *   get:
 *     summary: Bitta jamoa a'zosini ID bo'yicha olish
 *     tags: [Team]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Jamoa a'zosi ID si
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli
 *       404:
 *         description: A'zo topilmadi
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /team/{id}:
 *   put:
 *     summary: Jamoa a'zosini yangilash
 *     tags: [Team]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Jamoa a'zosi ID si
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               position:
 *                 type: string
 *               department:
 *                 type: string
 *               photo:
 *                 type: string
 *               bio:
 *                 type: string
 *               social:
 *                 type: object
 *               isFeatured:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: A'zo muvaffaqiyatli yangilandi
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       404:
 *         description: A'zo topilmadi
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /team/{id}:
 *   delete:
 *     summary: Jamoa a'zosini o'chirish
 *     tags: [Team]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Jamoa a'zosi ID si
 *     responses:
 *       200:
 *         description: A'zo muvaffaqiyatli o'chirildi
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       404:
 *         description: A'zo topilmadi
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

router
	.route('/')
	.get(getTeamMembers)
	.post(protect, authorize('admin', 'super-admin'), createTeamMember)

router.route('/featured/list').get(getFeaturedTeamMembers)

router.route('/department/:department').get(getTeamByDepartment)

router
	.route('/:id')
	.get(getTeamMember)
	.put(protect, authorize('admin', 'super-admin'), updateTeamMember)
	.delete(protect, authorize('admin', 'super-admin'), deleteTeamMember)

module.exports = router
