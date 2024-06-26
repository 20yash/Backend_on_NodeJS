//asyncHandler files creates a method and exports it.
//asyncHandler file is a helder file in whic we have req, res, next and we handle it using promises
//in case we get any problem, we have a wrapper here, everytime we need not to place everything in promises-try catch

//explaining asynchandler with both Promises and try-catch


//a function passed within a function
// const asyncHandler = ()=>{}
// const asyncHandler =(function)=>{(),{}}
// //or
// const asyncHandler =(func)=>()=>{}
//making it async-await function
// const asyncHandler =(func)=>async()=>{}

//using async-await here


// const asyncHandler = (fn)=> async(req,res,next)=>{
//     try {
//         await fn(req,res,next)
        
//     } catch (error) {
//         res.status(500).json({message:error.message})
        
//     }
// }


//using promises here; does the same thing

const asyncHandler =(requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch
        ((err)=>next(err))
    }
}



export {asyncHandler}


