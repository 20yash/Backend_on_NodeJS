//cloudinary is a service similary like AWS
//file is uploaded into the server in cloudinary
//we will be using multer, will be taking the file from the user and on temporary basis will place it on our local server
//using cloudinary, we will take the file from local storage and place this in server

import {v2 as cloudinary} from 'cloudinary'

import fs from 'fs'//this is file system in node; Read write, permission etc


    //configuration of cloudinary
    // These codes are directly from cloudinary documentation
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dbqdsevnc', 
        api_key: process.env.CLOUDINARY_API_KEY || '816559398911999', 
        api_secret: process.env.API_SECRET || 'P35DNbuMEfPSEMPV7bZ6O1-fPik'
    });



    const uploadOnCloudinary = async (localFilePath)=>{
        try {
            if(!localFilePath) return null

            //upload file on cloudinary
            const response = await cloudinary.uploader.upload(localFilePath,{
                resource_type:"auto"//detect whichever type of file it is
            })
            //file has been uploaded successfully
            // console.log("file is uploaded on cloudinary",response.url);
            fs.unlinkSync(localFilePath)
            return response
            
        } catch (error) {
            fs.unlinkSync(localFilePath)//remove the locally saved temporary file as upload operation got failed
            return null
            
        }
    }


export{uploadOnCloudinary}