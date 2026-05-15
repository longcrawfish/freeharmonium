import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { headers } from 'next/headers';

const REDIS_RATE_LIMIT_KEY = 'newsletter:rate-limit';
const DAY_MAX_SUBMISSIONS = parseInt(process.env.DAY_MAX_SUBMISSIONS || '10');

let limiter: Ratelimit | null = null;

function getRateLimiter() {
  if (limiter) {
    return limiter;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error('Upstash Redis is not configured');
  }

  const redis = new Redis({ url, token });

  limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(DAY_MAX_SUBMISSIONS, '1d'),
    prefix: REDIS_RATE_LIMIT_KEY,
  });

  return limiter;
}

// Shared rate limit check
export async function checkRateLimit() {
  const headersList = await headers();
  const ip = headersList.get('x-real-ip') ||
    headersList.get('x-forwarded-for') ||
    'unknown';

  const { success } = await getRateLimiter().limit(ip);
  if (!success) {
    throw new Error('Too many submissions, please try again later');
  }
}
