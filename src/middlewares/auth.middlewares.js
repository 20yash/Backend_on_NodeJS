//this will verify the user is present or not


//whenever we verified the user,use provided access token and refresh token; this is the basis of true login
//true login is having the correct token
//if the toekn values are correct, we can add an object in req.body->req.user

import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js"



export const verifyJWT = asyncHandler(async(req,res,next)=>{
    try {
        //token access
        //request has cookies access
        const token = req.cookies?.accessToken ||req.header("Authorization")?.replace("bearer","")//this tells to take the cookie from cookie or authorization
        //we get bearer <space> token
        //using replace here to skip the bearer and replace with emoty string 
    
    
        if(!token){
            throw new ApiError(401,"unauthorised request,access token not found ")
        }
    
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET || 'chai-aur-code')
        const user = User.findById(decodedToken?._id).select ("-password -refreshToken")
    
            if(!user){
                //TODO discussion about frontend in upcomig sessions
                throw new ApiError(401,"invalid access token")
            }
    
            req.user = user;
            next()
    } catch (error) {
        throw new ApiError(401,error?.message||"Invalid access token")        
    }



})
//whenever we verified the user,use provided access token and refresh token; this is the basis of true login
