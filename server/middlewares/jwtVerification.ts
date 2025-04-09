import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

const verifyAndAttachUser = async (req: Request, res: Response, next: NextFunction) => {
   const accessToken = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : req.cookies?.token
   if(!accessToken) res.status(401).json({error: "Authentication Required: Missing Token"})
    try{
      const verifiedAccessToken = await jwt.verify(accessToken, process.env.JWT_SECRET!)
      req.user = verifiedAccessToken
      next()
    } catch(error){
    console.error(error)
    res.status(401).json({error: "Invalid or Expired accessToken"})
  }
}

export default verifyAndAttachUser