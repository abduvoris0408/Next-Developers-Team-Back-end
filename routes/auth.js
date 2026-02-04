const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
} = require('../controllers/authController');

const router = express.Router();

const { protect } = require('../middleware/auth');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Ro'yxatdan o'tish
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       201:
 *         description: Muvaffaqiyatli ro'yxatdan o'tildi
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Tizimga kirish
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli kirildi
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Tizimdan chiqish
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli chiqildi
 */
router.get('/logout', logout);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Joriy user ma'lumotlari
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User ma'lumotlari
 */
router.get('/me', protect, getMe);

/**
 * @swagger
 * /auth/updatedetails:
 *   put:
 *     summary: User ma'lumotlarini yangilash
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ma'lumotlar yangilandi
 */
router.put('/updatedetails', protect, updateDetails);

/**
 * @swagger
 * /auth/updatepassword:
 *   put:
 *     summary: Parolni yangilash
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Parol yangilandi
 */
router.put('/updatepassword', protect, updatePassword);

module.exports = router;
