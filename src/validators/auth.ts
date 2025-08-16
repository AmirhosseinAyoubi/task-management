import Joi from "joi";

export const registerSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.alphanum': 'Username must contain only alphanumeric characters',
            'string.min': 'Username must be at least 3 characters long',
            'string.max': 'Username cannot exceed 30 characters',
            'any.required': 'Username is required'
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .min(6)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)'))
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters long',
            'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, and one number',
            'any.required': 'Password is required'
        }),

    firstName: Joi.string()
        .max(50)
        .optional()
        .messages({
            'string.max': 'First name cannot exceed 50 characters'
        }),

    lastName: Joi.string()
        .max(50)
        .optional()
        .messages({
            'string.max': 'Last name cannot exceed 50 characters'
        }),

    role: Joi.string()
        .valid('admin', 'manager', 'user')
        .default('user')
        .messages({
            'any.only': 'Role must be one of: admin, manager, user'
        })
});
export const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters long',
            'any.required': 'Password is required'
        }),
});
export const changePasswordSchema = Joi.object({
    currentPassword:Joi.string()
        .min(6)
        .required()
        .messages({
            'any.required': 'Current password is required'
        }),
    newPassword: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters long',
            'any.required': 'New password is required'
        }),
});