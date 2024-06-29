import { Router } from "express";


import { 
    logInUser,
    registerUser,
    logOutUser,
    refreshAccssToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory } from "../controllers/user.controller.js";



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

router.route('/refresh-token').post(refreshAccssToken)
//our logic does not require verifyJWT token as of now
//we donot require jwt middleware because everything is mentioned already in controller file; therefore verifyJWT middleware is not required

//route for change password
router.route('/change-Password').post(verifyJWT,changeCurrentPassword)

//route for current user
router.route('/current-user').get(verifyJWT,getCurrentUser)

//route for update account details

router.route('/update-account').patch(verifyJWT,updateAccountDetails)

//route for update avatar data

router.route('/avatar').patch(verifyJWT,upload.single("avatar"),updateUserAvatar)//as we are getting this from req.file, using multer middleware also here
//also, fetching from user.file not user.file; using upload.single as we need only one file to be updated


//route for updating user cover image; again this is coming from req.files, we will use multer middleware as well here

router.route('/cover-image').patch(verifyJWT,upload.single("/coverImage"),updateUserCoverImage)
//also, fetching from user.file not user.file; using upload.single as we need only one file to be updated



//router for getting user channel profiie
//we are getting this from params, we need to mention'/c/:username' we have specifically mentioned username in controller file therefore usernam is here
router.route('/c/:username').get(verifyJWT,getUserChannelProfile)



//router for getting user watch history

router.route('/history').get(verifyJWT,getWatchHistory)


export default router//since we are exporting default, the import statement in app.js file can be with any name(userRoutes name in our case)