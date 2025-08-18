import {Router} from "express";
import {authenticate, authorize} from "../middlewares/auth";
import {ROLES, ValidateLocation} from "../constants/enums";
import {validate} from "../middlewares/validate";
import {createNewUserSchema, getTeamSchema, userQuerySchema} from "../validators/user";
import {createUser, getAllUsers, getStats, getTeamMembers} from "../controllers/users";

const UserRoutes = Router()

UserRoutes.use(authenticate)


/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users - (admins only)
 *     description: Get all users by admin
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of users per page
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Filter by active users
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, manager, user]
 *         description: Filter by user role
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           default: test
 *         description: Search in username, email, firstname, and lastname
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
UserRoutes.get('/',authorize([ROLES.ADMIN]),validate(userQuerySchema,ValidateLocation.QUERY),getAllUsers)


/**
 * @swagger
 * /user:
 *   post:
 *     summary: create a new user (admins only)
 *     description: Create a new user account by admin
 *     tags: [User]
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
 *               isActive:
 *                 type: boolean
 *                 description: User's status
 *                 example: true
 *               team:
 *                  type: "array"
 *                  items:
 *                     type: "string"
 *               role:
 *                 type: string
 *                 enum: [admin, manager, user]
 *                 default: user
 *                 description: User's role
 *                 example: "user"
 *     responses:
 *       201:
 *         description: User created successfully
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
UserRoutes.post('/',authorize([ROLES.ADMIN]),validate(createNewUserSchema),createUser)

/**
 * @swagger
 * /user/stats:
 *   get:
 *     summary: get users stats (admins only)
 *     tags: [User]
 *     responses:
 *       200:
 *         description: stats retrieved successfully
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
 *                 data:
 *                   type: object
 *                   properties:
 *       429:
 *         description: Access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
UserRoutes.get('/stats',authorize([ROLES.ADMIN]),validate(userQuerySchema,ValidateLocation.QUERY),getStats)

/**
 * @swagger
 * /user/team/{id}:
 *   get:
 *     summary: get team members (admins and managers only)
 *     tags: [User]
 *     parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: manager id
 *     responses:
 *       200:
 *         description: team members retrieved successfully
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
 *                 data:
 *                   type: object
 *                   properties:
 *       429:
 *         description: Access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
UserRoutes.get('/team/:id',authorize([ROLES.ADMIN,ROLES.MANAGER]),validate(getTeamSchema,ValidateLocation.PARAMS),getTeamMembers)

export default UserRoutes