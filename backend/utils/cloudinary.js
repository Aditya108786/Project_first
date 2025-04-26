//
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadCloudinary = async (localFilePath) => {
    if (!localFilePath) return null;

    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
          console.log( "response by cloudinary",response)
        console.log("File uploaded:", response.url);
        return response;
    } catch (error) {
        console.error("Upload failed:", error);
    } finally {
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath); // Ensure temp file is removed even if upload fails
        }
    }

    return null;
};

const deletefromcloudinar = async function(publicId){

    if(!publicId){
        return null
    }
      
  const response =   await cloudinary.uploader.destroy(publicId)
  console.log(response)

}



module.exports = uploadCloudinary