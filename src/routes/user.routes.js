import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares.auth.middleware.js"

const router = Router()

console.log("/register route file running");


router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

// http://localhost:8000/api/v1/users/register


router.route("/login").post(
    loginUser
)

// http://localhost:8000/api/v1/users/login

// secured routes

router.route("/logout").post(
    verifyJWT,
    logoutUser
)





export default router