import {asyncWrapper} from "../middlewares/asyncWrapper";
import User, {IUser} from "../models/user";
import jwt from 'jsonwebtoken'
import {config} from "../configs";
import {BAD_REQUEST, CREATED, NOT_FOUND, OK, UNAUTHORIZED} from "../constants/statusCodes";

const generateAccessToken = (userId: string, email: string, role: string) => {
    return (jwt as any).sign({userId, email, role}, config.jwtSecret)
}
const generateRefreshToken = (userId: string) => {
    return (jwt as any).sign({userId}, config.jwtRefreshSecret)
}

export const register = asyncWrapper(async (req, res) => {
    const {email, username, password, firstName, lastName, role} = req.body;
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
        email,
        password,
        username,
        firstName,
        lastName,
        role: role || 'user'
    })
    await user.save()
    const accessToken = generateAccessToken((user as any)._id.toString(), email, role)
    const refreshToken = generateRefreshToken((user as any)._id.toString())
    return res.status(CREATED).json({
        success: true,
        message: 'User registered successfully',
        data: {
            user: {
                id: (user as any)._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isActive: user.isActive,
                createdAt: (user as any).createdAt
            },
            tokens: {
                accessToken,
                refreshToken
            }
        }
    });
})
export const login = asyncWrapper(async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email})
    if (!user) {
        return res.status(UNAUTHORIZED).json({
            success: false,
            message: 'user is not exist! please register first.'
        })
    }
    const isPasswordMatched = await user.comparePassword(password)
    if (!isPasswordMatched) {
        return res.status(UNAUTHORIZED).json({
            success: false,
            message: 'invalid credentials.'
        })
    }

    const accessToken = generateAccessToken((user as any)._id.toString(), email, user.role)
    const refreshToken = generateRefreshToken((user as any)._id.toString())
    user.lastLogin = new Date()
    await user.save()
    return res.status(CREATED).json({
        success: true,
        message: 'Login successful',
        data: {
            user: {
                id: (user as any)._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isActive: user.isActive,
                createdAt: (user as any).createdAt
            },
            tokens: {
                accessToken,
                refreshToken
            }
        }
    });
})
export const getProfile = asyncWrapper(async (req, res) => {
    const userId = req.user?._id
    const user = await User.findById(userId).select('-password').populate('team', 'username firstName lastName role email')
    if (!user) {
        return res.status(NOT_FOUND).json({
            success: false,
            message: 'user not found'
        })
    }
    return res.status(OK).json({
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
                lastLogin: user?.lastLogin,
                createdAt: (user as any).createdAt,
                updatedAt: (user as any).updatedAt
            }
        }
    })
})
export const updateProfile = asyncWrapper(async (req, res) => {
    const {email, username, firstName, lastName, role, team} = req.body
    const userId = req.user?._id
    if (username) {
        const user = await User.findOne({username, _id: {$ne: userId}})
        if (user) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: "Username already taken"
            })
        }
    }
    const newInfo = {}
    if (email) newInfo['email'] = email
    if (username) newInfo['username'] = username
    if (firstName) newInfo['firstName'] = firstName
    if (lastName) newInfo['lastName'] = lastName
    if (role) newInfo['role'] = role
    if (team) newInfo['team'] = team

    const updatedUser = await User.findByIdAndUpdate(userId, newInfo, {
        new: true,
        runValidators: true
    }).select('-password')
        .populate('team', 'username firstName lastName email role');

    if (!updatedUser) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
    req.body = updatedUser
    return res.status(OK).json({
        success: true,
        data: {
            user: {
                id: (updatedUser as any)._id,
                username: updatedUser.username,
                email: updatedUser.email,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                role: updatedUser.role,
                isActive: updatedUser.isActive,
                team: (updatedUser as any).team,
                lastLogin: updatedUser?.lastLogin,
                createdAt: (updatedUser as any).createdAt,
                updatedAt: (updatedUser as any).updatedAt
            }
        }
    })
})

export const changePassword = asyncWrapper(async (req, res) => {
    const {currentPassword, newPassword} = req.body
    const userId = req.user?._id
    const user = await User.findById(userId)
    const validPassword = await user.comparePassword(currentPassword)
    if (!validPassword) {
        return res.status(BAD_REQUEST).json({
            success: false,
            message: "current password is not valid"
        })
    }

    user.password = newPassword
    user.save()

    return res.status(OK).json({
        success: true,
        data: {},
        messages: ['password has been updated successfully']
    })
})

export const refreshToken = asyncWrapper(async (req, res) => {
    const {refreshToken} = req.body
    try {
        const decoded = await jwt.verify(refreshToken, config.jwtRefreshSecret)
        const user = await User.findById(decoded?.userId)
        if (!user) {
            return res.status(BAD_REQUEST).json({
                success: false,
                messages: ['user not found']
            })
        }
        const accessToken = generateAccessToken((user as any)._id.toString(), user.email, user.role)
        return res.status(OK).json({
            success: true,
            message: 'Token updated successfully',
            data: {
                user: {
                    id: (user as any)._id,
                    username: user.username,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    isActive: user.isActive,
                    createdAt: (user as any).createdAt
                },
                tokens: {
                    accessToken,
                    refreshToken
                }
            }
        });
    } catch (e) {
        return res.status(UNAUTHORIZED
        ).json({
            success: false,
            data: {},
            messages: ['Refresh token is not valid']
        })
    }

})