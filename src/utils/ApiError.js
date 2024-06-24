//motive of this file is to have our errors traced

class ApiError extends Error{
    constructor(
        statusCode,
        message="PLEASE PROVIDE A MESSAGE",
        errors=[],
        stack=""//error stack//check here
    ){
        //overwriting in a constructor
        //for overwriting, use super keyword
        super(message)
        this.statusCode=statusCode
        this.data=null
        this.message=message
        this.success=false
        this.errors=errors
        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}
export {ApiError}