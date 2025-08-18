import {Request, Response} from "express";
import User from "../models/user";
import {BAD_REQUEST, CREATED, OK} from "../constants/statusCodes";

export const getAllUsers = async (req: Request, res: Response) => {
    const {
        page = 1,
        limit = 10,
        role,
        isActive,
        search,
    } = req.query
    const newQuery = {}

    if (role) newQuery['role'] = role
    if (isActive !== 'undefined') newQuery['isActive'] = isActive === 'true'

    if (search) {
        newQuery['$or'] = [
            {username: {$regex: search, $options: 'i'}},
            {email: {$regex: search, $options: 'i'}},
            {firstname: {$regex: search, $options: 'i'}},
            {lastname: {$regex: search, $options: 'i'}},
        ]
    }
    const skip = (Number(page) - 1) * Number(limit)
    const total = await User.countDocuments(newQuery)
    const totalPages = Math.ceil(total / Number(limit))
    const users = await User.find(newQuery)
        .select('-password')
        .populate('team', 'username email firstName lastName role')
        .sort({createdAt: -1})
        .skip(skip)
        .limit(Number(limit))
    res.status(OK).json({
        success: true,
        data: {
            users: users.map(user => ({
                id: (user as any)._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isActive: user.isActive,
                team: (user as any).team,
                lastLogin: user.lastLogin,
                createdAt: (user as any).createdAt,
                updatedAt: (user as any).updatedAt
            })),
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages,
                hasNext: Number(page) < totalPages,
                hasPrev: Number(page) > 1
            }
        }
    });
}

export const createUser = async (req: Request, res: Response) => {
    const {
        username,
        email,
        password,
        firstName,
        lastName,
        role,
        isActive,
        team,
    } = req.body

    const existingUser = await User.findOne({$or: [{email}, {username}]})
    if (existingUser) {
        return res.status(BAD_REQUEST).json({
            success: false,
            message: existingUser.email === email
                ? 'Email already registered'
                : 'Username already taken'
        })
    }

    const user = new User({
        username,
        email,
        password,
        firstName,
        lastName,
        role,
        isActive,
        team,
    })

    await user.save()


    res.status(CREATED).json({
        success: true,
        data: {
            user: {
                id: (user as any)._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isActive: user.isActive,
                team: (user as any).team,
                lastLogin: user.lastLogin,
                createdAt: (user as any).createdAt,
                updatedAt: (user as any).updatedAt
            }
        }
    })
}

export const getStats = async (req: Request, res: Response) => {
    const [totalUsers, totalAdmins, totalManagers, totalActiveUsers] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({role: 'admin'}),
        User.countDocuments({role: 'manager'}),
        User.countDocuments({role: 'user'}),
        User.countDocuments({isActive: true})

    ])
    res.status(OK).json({
        success: true,
        data: {
            user: {
                totalUsers,
                totalAdmins,
                totalManagers,
                totalActiveUsers,
            }
        }
    })
}