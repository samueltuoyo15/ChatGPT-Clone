import { rateLimit, RateLimitRequestHandler } from "express-rate-limit"
import { Request } from "express"

export const createBasicRateLimiter = (maxRequest: number, timeInMs: number): RateLimitRequestHandler => {
  const seconds = Math.floor(timeInMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  let timeString: string
  
  if (hours >= 1) {
    timeString = `${hours} hour${hours > 1 ? 's' : ''}`
  } else if (minutes >= 1) {
    timeString = `${minutes} minute${minutes > 1 ? 's' : ''}`
  } else {
    timeString = `${seconds} second${seconds > 1 ? 's' : ''}`
  }

  return rateLimit({
    max: maxRequest,
    windowMs: timeInMs,
    message: `Too many request, Please try again later in the next ${timeString}`,
    standardHeaders: true,
    legacyHeaders: false
  })
}







