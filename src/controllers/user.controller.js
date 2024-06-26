


//we get all data from req.body(if we are getting data from JSON or form, we receive it from req.body)
     

//here we can access only data(in JSON), no files, we have created a mioddleware for multer, will use thois in user routes to access files


import { response } from "express"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js"//since user model directly contacts with mongoose, we can use this to check for validity of user present or not
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"



//we wil using refresh and access token multiple times, therefore we are creating a method for it

const generateAccessAndRefreshToken = async(userId)=>{//getting detail of userId from User 
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()//these are methods, always use parenthesis
        const refreshToken = user.generateRefreshToken()//these are methods, always use parenthesis

        //refresh token is saved in database so we do not access password from the user, access token is given to the user
        //adding refreshtoken in the database
        //adding values in objects

        user.refreshToken= refreshToken
        await user.save({validateBeforeSave:false})//saving this into the database; validateBeforeSave is false because in user we have password as well, we do not need validation to save refresh token while saving this 

        //returning access and refresh token now

        return {accessToken, refreshToken}

        
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating Refresh and access token")
        
    }

}

//a method to register a user
const registerUser = asyncHandler( async(req, res)=>{
    //steps required to register a user

    //steps I thought of
    // 1.check for unique user details (username and Email)
    // 2.check for password
    // 3.check for avatar and cover image uploaded on cloudinary
    // 4.check for validity of path of avatar and cover image


    // (steps discussed in video)
    //get user details
    // validation(@ in email,  correct username , not empty); not empty 
    // check if user already exists(check with usernam and email)
    // check for images, check for avatar
    // upload them to cloudinary(we already made a utility for cloudinary),avatar
    // create user Object,-crate creation call/ create entry in db (since we are using mongodb, in this objects are made)
    // remove password and refreshtoken field from response
    // check for user creation
    // return response

    //getting user details from frontend


    const { fullname ,username, email , password } = req.body//destructuring
    // console.log("email",email);
    //check for email via postman 

    //validation for username,email,fullname and password 

    //this is old approach
    // if(fullname === ""){
    //     throw new ApiError(400,"Full nam is required")//look for the fields in ApiError Contructor as the text passed here matches the criteria
    // }

    //new syntax
    //we can do this with multiple if as weel but this is a better approach

    if(
        [fullname,email,username,password].some((field)=> field?.trim()==="")//some function returns true or false and traverses each field
        //if any field is empty, then we throw an error 
    ){
        throw new ApiError(400,"all fields are complusory and required")
    }

    // check if user already exists(check with usernam and email)

    //old approach to check for the username and email
    // User.findOne({username,email})

    //new approach, much efficient
    const existedUser = await User.findOne({
        $or: [{username},{email}]// we are using an operator here ($ or) ,it gives us an array and we can check for multiple records

    })
    if(existedUser){
        throw new ApiError(409,"Username/email already exists")
    }
    // console.log("existed user log check",existedUser);//check

     // check for images, check for avatar
    
     //since we have added a middleware for multer in routes file, we can use req.files to access files in place of req.body
     //multer has now provided us the access of req.files

    const avatarLocalPath = req.files?.avatar[0]?.path;
    //we need first property, if we take first property;we can get complete path which multer has uploaded 
    
    
    
    // const coverImageLocalPath = req.files?.coverImage[0]?.path
    //since we have not provided check for cover image here, we can check this by classic if conditions, whether we have received cover images or not
    
    let coverImageLocalPath;
    if((req.files) && Array.isArray(req.files.coverImage) && (req.files.coverImage.length >0)){
        coverImageLocalPath = req.files.coverImage[0].path
    }
    
    
    
    // console.log("req.files log check",req.files);//check
    // console.log("req.body log check",req.body);//check


    // check for images, check for avatar
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is mandatory here")
    }

    // upload them to cloudinary(we already made a utility for cloudinary),avatar

    const avatar = await uploadOnCloudinary(avatarLocalPath)//uploading the image might take some time, therefore await here, we intentionally want this to wait
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){//as avatar field is mandatory, we have given a condition to check for avatar
        throw new ApiError(400,"Avatar is a mandatory field")
    }


    // create user Object,-crate creation call/ create entry in db (since we are using mongodb, in this objects are made)
    const user = await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",//since we have not provided check for cover image but have done for avatar
        email,
        password,
        username:username.toLowerCase()
    })
    //if we can find the user using id, we are certain that user is created
    // remove password and refreshtoken field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" //responsible for omitting password and refreshtoken field
    )//using select method to unselect password and refresh token; both are separated by a space ; little wierd syntax; by default, all values are selected and we use '-' to deselect 


    //checking whether the user is empty or not
    if(!createdUser){
        throw new ApiError(500,"User creation failed")
    }

    // return response
    //we have created API response file in utils, using this to return the response as we did for ApiError

    return res.status(201).json(
        new ApiResponse(200,createdUser, "User Registered successfully")
    )

      
})

    //______register for user ends here____
    //______login for user starts here____

const logInUser = asyncHandler(async(req,res)=>{

    //Todo steps required to login a user
    //Steps I thought of
    //authneticate for username/email from req.body
    //authenticate the password of the user
    //generate a access token and refresh token
    //match the refresh token with the token present already in the database

    //(steps discussed in video)
    //1.get data from req.body
    //2. check username or email present or not
    //3.find the user
    //4.check for the password
    //5.send access and refresh token to the user
    //6.send secure cookies



    //1.get data from req.body
    const{email,username,password}=req.body

    if(!(username||email)) 
        {
            throw new ApiError(400,"username or email is required")
        }



    //2. check username or email present or not
    const user = await User.findOne({
        $or: [{username},{email}]
    })//checking for username and email from database using $or: operator
    //$or: is a moongoose opeartor; similar to or operation



    //3.find the user
    if(!user) 
        {
            throw new ApiError(404,"user does not exist")
        }



    //4.check for the password
        const isPasswordValid = await user.isPasswordCorrect(password)

        if(!isPasswordValid){
            throw new ApiError(401,"password is not correct,Try again!")
        }

    //5.send access and refresh token to the user

    //generateAccessAndRefreshToken method is  defined above

    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)
    //accessToken And refreshToken is returned above in the function


    //6.send secure cookies
    const loggedInUser = await User.findById(user._id).select(" -password -refreshToken ")//skippinng password and refresh token field

    //sending cookies now
    //to send cookies, we need to define some options here

    const options ={
        httpOnly:true,
        secure:true
    }//anyone can modify our cookies, but when we mark httpOnly and secure as true, it is now modifiable only by sever

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)//we have access of cookies as we have installed cookie parser earlier;
    .cookie("refreshToken",refreshToken,options) // we have injected the cookie middleware Earlier
    .json(
        new ApiResponse(200,{user:loggedInUser,accessToken,refreshToken},"user loggedin successfully")
    )

})



    //______login for user ends here____
    //______logOut for user starts here____

    const logOutUser = asyncHandler(async(req,res)=>{

        //steps involved to logout a user
        //1.clear the cookies
        //2.clear the access and refresh token 

        //we will be designing our own middleware now

        await User.findByIdAndUpdate (
            //we have access to req.user which defined in the middleware
            //user was login->you had the access token->we hit a query on database and added a req.user
            req.user._id,//req.user is used here from the middleware we designed verifyJWT
            {
                $set:{
                    refreshToken:undefined//deleting the refresh token 
                }
            },
            {
                new:true//getting the new updated value
            }
        )
        const options ={
            httpOnly:true,
            secure:true
        }
        return res.status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options)
        .json(new ApiResponse(200,{},"user logged out successfully"))

    })


    //___logout for user ends here___
    //___creating endpoint for refresh access token___

    //we are creating an endpoint here so that whenever the user hits this endpoint, it refreshesh the access token
    //we will send our refresh token with the request; if both matches (one present in db and one refresh token received)
    // we will provide a new refresh token
    //new access token in cookies and new refresh token is saved in the memory; this is what we will do here

    const refreshAccssToken = asyncHandler(async(req,res)=>{
        //we can take refresh token directly from cookies
       const incomingRefreshToken = req.cookies.refreshToken ||req.body.refreshToken

       if(!incomingRefreshToken) {
        new ApiError(401,"unauthorised access")
       }

       try {
        const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
 
        //since we have only _id in refresh token; writing a query to get access of user from MongoDB
 
        const user = await User.findById(decodedToken?._id)
 
        if(!user){
         throw new ApiError(401,"Invalid refresh Token")
        }
 
        //now comparing both original refresh token (defined in user)and incoming refresh token
 
        if(incomingRefreshToken !== user?.refreshToken){
         throw new ApiError(401,"invalid refresh token/Expired Token")
        }
 
        //now generating a new refresh token using the method, generate a new access and refresh token
        const {accessToken,newRefreshToken}= await generateAccessAndRefreshToken(user._id)
        const options = {
         httpOnly:true,
         secure:true
        }
        return res(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
         new ApiResponse(200,
             {accessToken,refreshToken:newRefreshToken},"Access token refreshed successfully"))
       } catch (error) {
        throw new ApiError(401,error?.message||"invalid refresh token, try again")
        
       }
    })

    //_____________Mnaging subscription category now_____________

    const changeCurrentPassword = asyncHandler(async(req,res)=>{
        const{oldPassword, newPassword} = req.body
        //if auth middleware is running, it is confirmed that req.user is running and user is logged in for sure

        const user = await User.findById(req.user?._id)
        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)


        if(!isPasswordCorrect){
            throw new ApiError(400,"invalid old password")
        }

        user.password = newPassword
        await user.save({validateBeforeSave:false})

        return res.status(200).json(new ApiResponse(200,{},"password change success"))

    })


        //_____getting current user after changing the password______

        const getCurrentUser = asyncHandler(async(req,res)=>{
            return res.status(200).json((new ApiResponse(200,req.user,"current user fetched successfully")))
            //because middleware is running at our request,user is injected in the object here

        })

        //____thinking for more scenerios, as youtube does not allow to change username____

        const updateAccountDetails= asyncHandler(async(req,res)=>{
            const{fullname,email}=req.body

            if(!(fullname || email)){
                throw new ApiError(400,"all mandatory fields are required")
            }
            const user = await User.findByIdAndUpdate(req.user?._id,
                {
                    $set:{
                        fullname:fullname,//we can also write directly fullname
                        email:email//we can also write directly email
                    }.select("-password")
                },
                {new:true})
            //this takes 3 parameter;one is query, other is object which is empty and third isnew:true, this means data info which is updated is returned to the user
            
            //now returning this

            return res.status(200).json(new ApiResponse(200,user,"account details are saved here"))
        })


        //______updating avatar_______

        const updateAvatar = asyncHandler(async(req,res)=>{
            const avatarLocalPath = req.file?.path

            if(!avatarLocalPath){
                throw new ApiError(400,"avatar file is missing")
            }

            const avatar = await uploadOnCloudinary(avatarLocalPath)

            if(!(avatar.url)){
                throw new ApiError(400,"coudn't find avatar URL path")
            }

            const updatingAvatar = await findByIdAndUpdate(req.file?._id,{
                $set:{
                    avatar:avatar.url
                }
            },
            {new:true}
        ).select("-password")

            return res.status(200).json(new ApiResponse(200,updatingAvatar,"avatar details uploaded on cloudinary"))

        })


        //________updating cover Image_______

        const updateUserCoverImage = asyncHandler(async(req,res)=>{

            const coverImagePath = req.file?._id

            if(!coverImagePath){
                throw new ApiError(400,"cover Image file is missing")
            }

            const coverImage = await uploadOnCloudinary(coverImagePath)

            if(!(coverImage.url)){
                throw new ApiError(400,"cover Image url Path coudn't be found")
            }

            const updatingCoverImage = await findByIdAndUpdate(req.user?._id,
                {
                    $set:{
                        coverImage:coverImage.url
                    }
                },
                {new:true}.select("-password"))

            return res.status(200).json(new ApiResponse(200,updatingCoverImage,"cover image is updated successfully")) 
        })


export {registerUser,logInUser,logOutUser,refreshAccssToken,changeCurrentPassword,getCurrentUser,updateAccountDetails,updateAvatar,updateUserCoverImage}