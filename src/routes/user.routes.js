import { Router } from "express";
import { logInUser,registerUser,logOutUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router()

//injecting multer middleware just before reguisterUser which is the controller file

router.route('/register').post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }

    ]),
    registerUser
)

//understanding and writing a middleware here
router.route('/login').post(logInUser)

//secured routes

router.route('/logout').post(verifyJWT,logOutUser)//invoking a middleware here in logOutUser,verifyJWT

export default router//since we are exporting default, the import statement in app.js file can be with any name(userRoutes name in our case)