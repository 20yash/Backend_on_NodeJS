class ApiResponse{
    constructor(statusCode,data,message="Success"){
        this.statusCode=statusCode
        this.data=data
        this.message=message
        this.success=statusCode
        this.success=statusCode<400
        //status code 100 to 199 is informational responses
        //status code 200 to 299 is successful responses
        //status code 300 to 399 is redirection messages
        //status code 400 to 499 is client error responses
        //status code 500 to 599 is server error responses
    }
}