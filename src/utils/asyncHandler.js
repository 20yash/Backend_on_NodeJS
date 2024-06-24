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
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((error)=>next(error))
    }
}






export {asyncHandler}


