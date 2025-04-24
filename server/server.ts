import express, { Application } from "express"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import session from "express-session"
import { createBasicRateLimiter } from "@/middlewares/rate.limit"
import { corsConfig } from "@/config/cors.config"
import { requestLogger, addTimestamp } from "@/middlewares/request.logger"
import { urlVersioning } from "@/middlewares/url.versioning"
import authRoute from "@/routes/auth.route"
import dotenv from "dotenv"
dotenv.config()

  
const app = express()
app.use(requestLogger)
app.use(addTimestamp)
app.use(corsConfig())
app.use(createBasicRateLimiter(100, 900000))
app.use(helmet())
app.use(express.json())
app.set("trust proxy", "1")
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
   cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
   },
}))
app.use(urlVersioning("v1"))
app.use("/api/v1/auth", authRoute)

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
  })



