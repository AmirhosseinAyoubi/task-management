import Joi from "joi";

export const updateProfileSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .optional()
        .messages({
            'string.alphanum': 'Username must contain only alphanumeric characters',
            'string.min': 'Username must be at least 3 characters long',
            'string.max': 'Username cannot exceed 30 characters',
        }),

    email: Joi.string()
        .email()
        .optional()
        .messages({
            'string.email': 'Please provide a valid email address',
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