import rateLimit from "express-rate-limit";

export const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
});

export const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
});
