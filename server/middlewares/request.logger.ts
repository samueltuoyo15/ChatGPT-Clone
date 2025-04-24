import { Request, Response, NextFunction } from "express"

declare module "express" {
  interface Request {
    timestamp?: string
  }
}

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString()
  const method = req.method
  const url = req.url
  const userAgent = req.get("User-Agent")
  
  console.log(`[${timestamp}] ${method} ${url} - User-Agent: ${userAgent}`)
  next()
}

export const addTimestamp = (req: Request, res: Response, next: NextFunction) => {
  req.timestamp = req.timestamp || new Date().toISOString()
  next()
}