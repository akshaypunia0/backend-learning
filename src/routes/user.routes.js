import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

console.log("/register route running");


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


console.log("/login route running");

router.route("/login").post(
    loginUser
)

// http://localhost:8000/api/v1/users/login

// secured routes  --> User should be loggedin to use this

router.route("/logout").post(
    verifyJWT,
    logoutUser
)

router.route(/refresh-token).post(
    refreshAccessToken
)



export default router