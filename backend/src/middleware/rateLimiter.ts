import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const signinLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,

    keyGenerator: (req) => {
        return `${ipKeyGenerator(req.ip!)}-${req.body.email}`;
    },

    standardHeaders: true,
    legacyHeaders: false,

    message: {
        error: "Too many login attempts. Please try again in 15 minutes."
    }
});

export const signupLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Too many signup attempts. Please try again later."
    }
});

 export const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,

    keyGenerator: (req) => {
        return `${ipKeyGenerator(req.ip!)}-${req.body.email}`;
    },
    message: {
        error: "Too many password reset requests. Please try again later."
    }
});