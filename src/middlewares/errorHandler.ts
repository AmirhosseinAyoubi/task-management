import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((error: any) => ({
            field: error.path,
            message: error.message
        }));

        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors
        });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json({
            success: false,
            message: 'Duplicate field error',
            errors: [{ field, message: `${field} already exists` }]
        });
    }

    // Mongoose cast error (invalid ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID format',
            errors: [{ field: 'id', message: 'Invalid ID provided' }]
        });
    }

    // Default error
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        errors: [{ field: 'server', message: 'Something went wrong' }]
    });
};



