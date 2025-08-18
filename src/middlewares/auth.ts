import {NextFunction, Request, Response} from "express";
import jwt from 'jsonwebtoken'
import User, {IUser} from "../models/user";
import {ACCESS_DENIED, BAD_REQUEST, UNAUTHORIZED} from "../constants/statusCodes";
import {config} from "../configs";
import {ROLES} from "../constants/enums";

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

interface jwtPayload {
    email: string,
    username: string,
    role: string,
    iat: number,
    exp: number
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization
        const token = authHeader?.substring(7)
        if (!authHeader || !authHeader?.startsWith('Bearer ') || !token) {
            return res.status(UNAUTHORIZED).json({
                success: false,
                message: "Access token is required, please provide a valid token"
            })
        }

        const decoded = await jwt.verify(token, config.jwtSecret) as jwtPayload

        const user = await User.findOne({$or: [{email: decoded.email}, {username: decoded.username}]})
        if (!user) {
            return res.status(UNAUTHORIZED).json(
                {
                    success: false,
                    message: "User not found.Token maybe invalid"
                })
        }
        req.user = user
        next()


    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Please provide a valid access token.'
            });
        }

        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                success: false,
                message: 'Token expired. Please login again.'
            });
        }

        console.error('Authentication error:', error);
        return res.status(500).json({
            success: false,
            message: 'Authentication failed. Please try again.'
        });
    }
}
export const authorize = (roles:Array<ROLES>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try{
            if (!req.user) {
                return res.status(UNAUTHORIZED).json({
                    success: false,
                    message: 'Authentication required'
                });
            }
            const userRole=req.user?.role
            if(!roles.includes(userRole)){
                return res.status(ACCESS_DENIED).json({
                    success:false,
                    messages:['access denied']
                })

            }
            next()
        }
        catch (e) {
            return res.status(BAD_REQUEST).json({
                success:false,
                messages:['Authorization failed']
            })
        }

    }
}