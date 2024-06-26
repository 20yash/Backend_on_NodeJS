import express from 'express'
import cors from 'cors'
import cookieParse from 'cookie-parser'

const app = express()


//app.use; here use method is used for middlewares
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

//configuring
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))//static folder here to store files, folders on our own server
app.use(cookieParse())


//importing in app.js file
//importing routes
import router from './routes/user.routes.js'

//routes declaration
app.use("/api/v1/users",router)
//url structure now becomes http://localhost:8000/api/v1/users/register

//routes declaration

export {app}