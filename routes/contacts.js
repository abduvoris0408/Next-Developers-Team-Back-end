const express = require('express')
const {
	getContacts,
	getContact,
	createContact,
	updateContact,
	deleteContact,
	addNote,
	assignContact,
	getContactStats,
} = require('../controllers/contactController')

const router = express.Router()

const { protect, authorize } = require('../middleware/auth')

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: Aloqa so'rovlari
 */

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Yangi aloqa so'rovi yuborish (public contact form)
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: So'rov muvaffaqiyatli yuborildi
 *       400:
 *         description: Majburiy maydonlar to'ldirilmagan
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Barcha aloqa so'rovlarini olish (admin uchun)
 *     tags: [Contacts]
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
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   subject:
 *                     type: string
 *                   message:
 *                     type: string
 *                   status:
 *                     type: string
 *                     enum: [new, in-progress, resolved]
 *                   assignedTo:
 *                     type: string
 *                   notes:
 *                     type: array
 *                     items:
 *                       type: object
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /contacts/stats/overview:
 *   get:
 *     summary: Aloqa so'rovlari bo'yicha umumiy statistika (admin uchun)
 *     tags: [Contacts]
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
 *                 total:
 *                   type: integer
 *                 new:
 *                   type: integer
 *                 inProgress:
 *                   type: integer
 *                 resolved:
 *                   type: integer
 *                 byMonth:
 *                   type: object
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     summary: Bitta aloqa so'rovini olish (admin uchun)
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: So'rov ID si
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       404:
 *         description: So'rov topilmadi
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /contacts/{id}:
 *   put:
 *     summary: Aloqa so'rovini yangilash (status, assign va h.k.) (admin uchun)
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: So'rov ID si
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [new, in-progress, resolved]
 *               assignedTo:
 *                 type: string
 *     responses:
 *       200:
 *         description: So'rov muvaffaqiyatli yangilandi
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       404:
 *         description: So'rov topilmadi
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Aloqa so'rovini o'chirish (admin uchun)
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: So'rov ID si
 *     responses:
 *       200:
 *         description: So'rov muvaffaqiyatli o'chirildi
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       404:
 *         description: So'rov topilmadi
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /contacts/{id}/notes:
 *   post:
 *     summary: So'rovga izoh (note) qo'shish (admin uchun)
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: So'rov ID si
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - note
 *             properties:
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Izoh muvaffaqiyatli qo'shildi
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       404:
 *         description: So'rov topilmadi
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /contacts/{id}/assign/{userId}:
 *   put:
 *     summary: So'rovni foydalanuvchiga biriktirish (admin uchun)
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: So'rov ID si
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: Biriktiriladigan foydalanuvchi ID si
 *     responses:
 *       200:
 *         description: So'rov muvaffaqiyatli biriktirildi
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Faqat admin yoki super-admin ruxsat etilgan
 *       404:
 *         description: So'rov yoki foydalanuvchi topilmadi
 *       500:
 *         $ref: '#/components/schemas/Error'
 */

// Public route - Contact form
router.route('/').post(createContact)

// Admin routes
router.use(protect)
router.use(authorize('admin', 'super-admin'))

router.route('/').get(getContacts)

router.route('/stats/overview').get(getContactStats)

router.route('/:id').get(getContact).put(updateContact).delete(deleteContact)

router.route('/:id/notes').post(addNote)

router.route('/:id/assign/:userId').put(assignContact)

module.exports = router
