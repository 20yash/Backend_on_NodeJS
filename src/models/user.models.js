import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    username:{
        type:String,                 
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,//cloudinary url, similary to aws service
        required:true
    },
    coverImage:{
        type:String,//cloudinary url, similary to aws service
        required:true
    },
    watchHistory:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Video'
    }
    ],
    password:{
        type:String,
        required:[true,'password is required']
    },
    refreshToken:{

    }
},{timestamps:true})

userSchema.pre("save",async function(next) {//we have used the function, it knows all the fields in schema; this is called HOOKS
    //do not use arrow function in pre as in arrow function we do not current context using this keyword
    if(!this.isModified("password")){
        return next()
    }
    this.password=bcrypt.hash(this.password,10)
    next()

})
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

//both generateAccessToken and generateRefreshToken are JWT token; usage is also similar
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,//INFO IN REFRESH TOKEN IS LESS
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema)