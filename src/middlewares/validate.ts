import {Schema} from "joi";
import {NextFunction, Request, Response} from "express";
import {STATUS_CODES} from "http";
import {BAD_REQUEST} from "../constants/statusCodes";

enum ValidateLocation {
    BODY = 'body',
    QUERY = 'query',
    PARAMS = 'params'
}

export const validate = (schema: Schema, location: ValidateLocation = ValidateLocation.BODY) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const dataToValidate = req[location]
        const {error, value} = schema.validate(dataToValidate, {
            abortEarly: false,
            stripUnknown: true,
            allowUnknown: false
        })
        if (error) {
            const errors = error.details.map(item => ({
                field: item.path.join('.'),
                message: item.message,
                type: item.type
            }))
            return res.status(BAD_REQUEST).json({
                success: false,
                message: 'validation error',
                errors
            })
        }

        req[location] = value
        next();

    }
}



