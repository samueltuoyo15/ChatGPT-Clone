import {Router} from "express";
import {registerUser, loginUser} from "../controllers/authController";

const router: Router = Router();

router.post("/signUp", registerUser.perform);
router.post("/signIn", loginUser.perform);

export default router;