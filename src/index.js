// require('dotenv').config({path:'./env'})//this will also work but this does not make our code consistent

import dotenv from 'dotenv'

// import mongoose from 'mongoose'
// import {DB_NAME} from './constants'

import connectDB from './db/index.js'

import {app} from './app.js'
dotenv.config({
    path:'./.env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`server is running at port ${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log("MongoDB connection failed",error)
})

//First approach to set up database

// import express from 'express'
// const app = express()
// (async ()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error",(error)=>{
//             console.log("cannot connect",error);
//             throw error
//         })

//         app.listen(process.env.PORT,()=>{
//             console.log(`app is listening on PORT ${process.env.PORT}`);
//         })
        
//     } catch (error) {
//         console.log("error",error);
//         throw error
        
//     }
// }
// )()//Using IIFE(immediately invoked function here),as the database will be the first thing to connect and execute


//second approach is,creating a separate file in db folder and importing the function from there to index.js file
//this second approach is much better