const express = require('express');
const adminController = require('../controllers/adminController');
const { protectAdmin } = require('../middlewares/adminAuth');

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *     Device:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         status:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Admin authentication routes
 *   - name: Users
 *     description: Manage users
 *   - name: Devices
 *     description: Pending & verified devices actions
 *   - name: Dashboard
 *     description: Admin dashboard analytics
 *   - name: Transactions
 *     description: Financial and account transactions
 *   - name: Health
 *     description: System monitoring
 */

/* ================================
    AUTHENTICATION ROUTES
   ================================ */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Admin login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login returns JWT token
 */
router.post('/auth/login', adminController.login);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get admin profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns admin profile details
 */
router.get('/auth/profile', protectAdmin, adminController.getProfile);

/* ================================
    USER MANAGEMENT ROUTES
   ================================ */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all registered users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/users', protectAdmin, adminController.getAllUsers);

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get specific user details
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: User details
 */
router.get('/users/:userId', protectAdmin, adminController.getUserById);

/**
 * @swagger
 * /users/{userId}/toggle-status:
 *   put:
 *     summary: Enable/disable user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Updated user status
 */
router.put('/users/:userId/toggle-status', protectAdmin, adminController.toggleUserStatus);

/* ================================
    DEVICE VERIFICATION ROUTES
   ================================ */

/**
 * @swagger
 * /devices/pending:
 *   get:
 *     summary: Get all pending device approvals
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending devices
 */
router.get('/devices/pending', protectAdmin, adminController.getPendingVerifications);

/**
 * @swagger
 * /devices/verify:
 *   post:
 *     summary: Approve a device registration
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Device verified successfully
 */
router.post('/devices/verify', protectAdmin, adminController.verifyDevice);

/**
 * @swagger
 * /devices/revoke:
 *   post:
 *     summary: Revoke a registered device
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Device revoked successfully
 */
router.post('/devices/revoke', protectAdmin, adminController.revokeDevice);

/* ================================
    DASHBOARD & ANALYTICS ROUTES
   ================================ */

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats data
 */
router.get('/dashboard/stats', protectAdmin, adminController.getDashboardStats);

/* ================================
   TRANSACTIONS ROUTES
   ================================ */

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get all transactions
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of transactions
 */
router.get('/transactions', protectAdmin, adminController.getAllTransactions);

/* ================================
    HEALTH CHECK ROUTE
   ================================ */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: API health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running status
 */
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Admin API is running' });
});

module.exports = router;
