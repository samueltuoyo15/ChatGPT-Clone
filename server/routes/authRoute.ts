import express, {Router} from "express";
import {registerUser, loginUser} from "../controllers/authController";

const router: Router = express.Router();

router.post("/signUp", registerUser);
router.post("/signIn", loginUser);

export default router;