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

export const userQuerySchema = Joi.object({
    page: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .messages({
            'number.base': 'Page must be a number',
            'number.integer': 'Page must be an integer',
            'number.min': 'Page must be at least 1'
        }),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(10)
        .messages({
            'number.base': 'Limit must be a number',
            'number.integer': 'Limit must be an integer',
            'number.min': 'Limit must be at least 1',
            'number.max': 'Limit cannot exceed 100'
        }),

    role: Joi.string()
        .valid('admin', 'manager', 'user')
        .optional()
        .messages({
            'any.only': 'Role must be one of: admin, manager, user'
        }),

    isActive: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': 'isActive must be a boolean value'
        }),

    search: Joi.string()
        .min(2)
        .max(50)
        .optional()
        .messages({
            'string.min': 'Search term must be at least 2 characters long',
            'string.max': 'Search term cannot exceed 50 characters'
        })
})

export const createNewUserSchema = Joi.object({
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
        }),
    isActive: Joi.boolean()
        .optional()
        .default(true)
        .messages({'boolean.base':'Is active must be a boolean value'}),
    team: Joi.array()
        .items(Joi.string().hex().length(24))
        .optional()
        .messages({
            'array.base': 'Team must be an array',
            'string.hex': 'Team member ID must be a valid MongoDB ObjectId',
            'string.length': 'Team member ID must be 24 characters long'
        })

})