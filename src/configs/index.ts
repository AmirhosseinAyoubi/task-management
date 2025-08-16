import dotenv from 'dotenv'

dotenv.config()

const env = process.env

export const config = {
    nodeEnv:env.NODE_ENV,
    port:env.PORT,
    mongoURI:env.MONGODB_URI,
    corsOrigin:env.CORS_ORIGIN,
    rateLimitWindowMs: Number(env.RATE_LIMIT_WINDOW_MS),
    rateLimitMax: Number(env.RATE_LIMIT_MAX),
    jwtSecret: env.JWT_SECRET,
    jwtExpiresIn: env.JWT_EXPIRES_IN,
    jwtRefreshSecret: env.JWT_REFRESH_SECRET,
    jwtRefreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,

}