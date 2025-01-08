import express from "express";
import {registerUser, loginUser} from "../controllers/authController";

const router = express.Router();

router.post("/signUp", registerUser);
router.post("/signIn", loginUser);

export default router;