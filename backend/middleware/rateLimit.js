const buckets = new Map();

const now = () => Date.now();

const defaultKey = (req) => req.ip || req.headers["x-forwarded-for"] || "unknown";

export const createRateLimiter = ({
  windowMs = 60 * 1000,
  max = 10,
  message = "Too many requests. Please try again later.",
  keyGenerator = defaultKey,
} = {}) => {
  return (req, res, next) => {
    const key = keyGenerator(req);
    const bucketKey = `${req.path}:${key}`;
    const current = now();

    const existing = buckets.get(bucketKey);
    if (!existing || existing.expiresAt <= current) {
      buckets.set(bucketKey, { count: 1, expiresAt: current + windowMs });
      return next();
    }

    if (existing.count >= max) {
      return res.status(429).json({ error: message });
    }

    existing.count += 1;
    buckets.set(bucketKey, existing);
    return next();
  };
};

// Basic periodic cleanup for expired buckets
setInterval(() => {
  const current = now();
  for (const [key, value] of buckets.entries()) {
    if (value.expiresAt <= current) {
      buckets.delete(key);
    }
  }
}, 5 * 60 * 1000).unref();

