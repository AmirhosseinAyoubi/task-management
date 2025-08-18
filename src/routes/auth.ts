import {Router} from "express";
import {validate} from "../middlewares/validate";
import {changePassword, getProfile, login, logout, refreshToken, register, updateProfile} from "../controllers/auth";
import {changePasswordSchema, loginSchema, refreshTokenSchema, registerSchema} from "../validators/auth";
import {authenticate} from "../middlewares/auth";
import {updateProfileSchema} from "../validators/user";

const AuthRoutes = Router()

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account with email, password, and basic information
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Unique username
 *                 example: "john_doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 description: User's password (min 6 characters)
 *                 example: "Password123!"
 *               firstName:
 *                 type: string
 *                 description: User's first name
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 description: User's last name
 *                 example: "Doe"
 *               role:
 *                 type: string
 *                 enum: [admin, manager, user]
 *                 default: user
 *                 description: User's role
 *                 example: "user"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     tokens:
 *                       type: object
 *                       properties:
 *                         accessToken:
 *                           type: string
 *                         refreshToken:
 *                           type: string
 *       400:
 *         description: Validation error or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
AuthRoutes.post('/register', validate(registerSchema), register)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: user login
 *     description: login
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
 *                 format: email
 *                 description: User's email address
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 description: User's password (min 6 characters)
 *                 example: "Password123!"
 *     responses:
 *       201:
 *         description: Login successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *       400:
 *         description: Validation error or user already exists
 *         content:
 *           application/json:
 *             schema:
 */
AuthRoutes.post('/login', validate(loginSchema), login)

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: user profile
 *     description: get profile of the user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: successful
 *         content:
 *           application/json:
 *             schema:
 *
 *       404:
 *         description: user not found
 *         content:
 *           application/json:
 *             schema:
 */
AuthRoutes.get('/profile', authenticate, getProfile)

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: update user profile
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
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Unique username
 *                 example: "john_doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 description: User's password (min 6 characters)
 *                 example: "Password123!"
 *               firstName:
 *                 type: string
 *                 description: User's first name
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 description: User's last name
 *                 example: "Doe"
 *               role:
 *                 type: string
 *                 enum: [admin, manager, user]
 *                 default: user
 *                 description: User's role
 *                 example: "user"
 *     responses:
 *       200:
 *         description: successful
 *         content:
 *           application/json:
 *             schema:
 *
 *       404:
 *         description: user not found
 *         content:
 *           application/json:
 *             schema:
 */
AuthRoutes.put('/profile', authenticate, validate(updateProfileSchema),updateProfile)

/**
 * @swagger
 * /auth/change-password:
 *   put:
 *     summary: change user password
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
 *                 description: currentPassword
 *                 example: "Password123!"
 *               newPassword:
 *                 type: string
 *                 description: currentPassword
 *                 example: "Password123!"
 *     responses:
 *       200:
 *         description: successful
 *         content:
 *           application/json:
 *             schema:
 *
 *       400:
 *         description: invalid password
 *         content:
 *           application/json:
 *             schema:
 */
AuthRoutes.put('/change-password', authenticate,validate(changePasswordSchema), changePassword)

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: get new token
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
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: refreshToken
 *                 example: "****"
 *     responses:
 *       200:
 *         description: successful
 *         content:
 *           application/json:
 *             schema:
 *
 *       401:
 *         description: invalid refresh token
 *         content:
 *           application/json:
 *             schema:
 */

AuthRoutes.post('/refresh', authenticate,validate(refreshTokenSchema), refreshToken)

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: logout
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: successful
 *         content:
 *           application/json:
 *             schema:
 */
AuthRoutes.post('/logout', logout)



export default AuthRoutes

