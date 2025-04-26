//
const asynchandler = require('../utils/asynchandler')
const usermodel = require('../models/user.model')
const FastingModel = require("../models/fasting.model");
const uploadcloudinary = require('../utils/cloudinary')
const jwt = require('jsonwebtoken')

const { default: mongoose } = require('mongoose')

const generateaccessandrefrestoken = async(userid)=>{
    try {
      const user  =   await usermodel.findById(userid)
    const accesstoken =   user.generateaccesstoken()
    const refreshtoken = user.generaterefreshtoken()

       user.refreshToken = refreshtoken
       user.save({validateBeforeSave:false})
       return({accesstoken, refreshtoken})
    } catch (error) {
        
    }
}


const registeruser = async function (req, res) {
  let { email, password, username, fullname } = req.body;
  console.log(req.body);

  if ([email, password, username, fullname].some((field) => !field?.trim())) {
    return res.status(400).send("All fields are required"); // ⬅ return added
  }

  let existeduser = await usermodel.findOne({
    $or: [{ email }, { username }],
  });

  if (existeduser) {
    return res.status(409).send("User already exists"); // ⬅ return added
  }

  console.log(req.files);
  const avatarlocalpath = req.files?.avatar?.[0]?.path;
  let coverimagelocalpath;

  console.log(avatarlocalpath);

  if (
    req.files &&
    Array.isArray(req.files.coverimage) &&
    req.files.coverimage.length > 0
  ) {
    coverimagelocalpath = req.files.coverimage[0].path;
  }

  if (!avatarlocalpath) {
    return res.status(400).send("Avatar not found"); // ⬅ return added
  }
  if (!coverimagelocalpath) {
    return res.status(400).send("Cover image not found"); // ⬅ return added
  }

  const avatar = await uploadcloudinary(avatarlocalpath);
  const coverimage = await uploadcloudinary(coverimagelocalpath);

  if (!avatar) {
    return res.status(500).send("Avatar upload error"); // ⬅ return added
  }

  const newUser = await usermodel.create({
    email,
    password,
    username,
    fullname,
    avatar: avatar.url,
    coverimage: coverimage.url,
  });

  const createduser = await usermodel.findById(newUser._id).select(
    "-password -refreshtoken"
  );

  console.log(createduser);

  if (!createduser) {
    return res.status(500).send("User creation failed"); // ⬅ return added
  }

  // TODO: generate tokens, set cookies etc.

  return res.status(201).json({ message: "User registered", user: createduser }); // ✅ final response
};

const loginuser = async function (req, res) {
  const { email, username, password } = req.body;
  console.log("Received Data:", req.body);

  if (!username && !email) {
    return res.status(400).json({ success: false, message: "Username or email required" });
  }

  const user = await usermodel.findOne({
    $or: [{ email }, { username }]
  });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const ispasswordvalid = await user.isPasswordCorrect(password);

  if (!ispasswordvalid) {
    return res.status(401).json({ success: false, message: "Invalid password" });
  }

  const { accesstoken, refreshtoken } = await generateaccessandrefrestoken(user._id);

  const loggedinuser = await usermodel.findById(user._id)
    .select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true
  };

  return res.status(200)
    .cookie("accesstoken", accesstoken, options)
    .cookie("refreshtoken", refreshtoken, options)
    .json({
      success: true,
      message: "Logged in successfully",
      user: loggedinuser
    });
}


const loggedout = async function(req, res) {
  try {
    // Check if user exists (from isloggedin middleware)
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Clear refresh token from database
    await usermodel.findByIdAndUpdate(
      req.user._id,
      { $unset: { refreshToken: 1 } },
      { new: true }
    );

    // Clear cookies properly
    res.clearCookie("accesstoken", { httpOnly: true, secure: true });
    res.clearCookie("refreshToken", { httpOnly: true, secure: true });

    return res.status(200).json({ message: "Logged out successfully" });

  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Server error during logout" });
  }
};


const refreshaccesstoken = async function(req,res){
  const incomingrefreshtoken = await  req.cookies.refreshtoken ||req.body.refreshtoken
  console.log(req.cookies)
        if(!incomingrefreshtoken){
          res.send("unauthorized")
        }

      const decodedtoken =   jwt.verify(incomingrefreshtoken,process.env.REFRESH_TOKEN_SECRET)

   const user =    await usermodel.findById(decodedtoken?._id)
     if(!user) {
      res.send("invalid refreshtoken")
     }  
     
     if(incomingrefreshtoken !== user?.refreshToken){
      res.send("not same")
     }
     
     const options = {
            httpOnly:true,
            secure:true
     }

     const{accesstoken, newrefreshToken} = await generateaccessandrefrestoken(user._id)

     return res.cookie("accesstoken", accesstoken).cookie("refrestoken", newrefreshToken)
}

const changepassword = async function(req,res){
     const{oldpassword, newpassword} = req.body

     const user =   await usermodel.findById(req.user?._id)
     const ispasswordcorrect = await user.isPasswordCorrect (oldpassword)
     
     if(!ispasswordcorrect){
      res.send("incorrect oldpassword")
     }
     
     user.password = newpassword
    await   user.save({validateBeforeSave:false})
     
    return res.send("password changed successfully")
}

const getcurrentuser = async function(req,res){
     
     return res.send(
        req.user
       )
}

const update = async function (req, res) {
  try {
    const { fullname } = req.body;

    if (!fullname ) {
      return res.status(400).json({ message: "Please provide fullname" });
    }

    const updatedUser = await usermodel.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          fullname,
          
        }
      },
      {
        new: true
      }
    ).select("-password -refreshToken");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


const updateuseravatar = async function(req, res) {
  try {
    const avatarlocalpath = req.file?.path;
       
    if (!avatarlocalpath) {
      return res.status(400).json({ message: "Avatar file is missing" });
    }

    const avatar = await uploadcloudinary(avatarlocalpath);
    
    if (!avatar.url) {
      return res.status(400).json({ message: "Failed to upload avatar to cloud" });
    }

    const updatedUser = await usermodel.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          avatar: avatar.url
        }
      },
      {
        new: true // return updated user
      }
    ).select("-password"); // exclude password from result

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Avatar updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("Error updating avatar:", error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};


const updateusercoverimage = async function(req,res){
    const coverlocalpath = req.file?.path

    if(!coverlocalpath){
      res.send("cover path not found")
    }

  const coverimage =  await uploadcloudinary(coverlocalpath)
    if(!coverimage.url){
      res.send("cover url not found")
    }

   await  usermodel.findByIdAndUpdate(
      req.user?._id,
      {
        $set:{
          coverimage
        }
      },
      {new:true}
    ).select("-password")

   return res.send("coverimage updated")
} 

const profiledetails = async function (req, res) {
  try {
      const { username } = req.params;

      if (!username) {
          return res.status(400).json({ error: "Enter username" });
      }

      const channel = await usermodel.aggregate([
          {
              $match: { username: username }
          },
          {
              $lookup: {
                  from: "subscriptions",
                  localField: "_id",
                  foreignField: "channel",
                  as: "subscribers"
              }
          },
          {
              $lookup: {
                  from: "subscriptions", // Fixed typo (was "subcriptions")
                  localField: "_id",
                  foreignField: "subscriber",
                  as: "subscribedto"
              }
          },
          {
              $addFields: {  // Fixed case-sensitive issue
                  subscribercount: { $size: "$subscribers" },
                  channelcount: { $size: "$subscribedto" }  // Renamed 'channel' to avoid confusion
              }
          },
          {
              $project: {
                  username: 1,
                  fullname: 1,
                  email: 1,
                  subscribers: 1,
                  subscribedto: 1,  // Fixed typo
                  avatar: 1,
                  coverimage: 1
              }
          }
      ]);

      if (!channel.length) {
          return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(channel); // Sending only the first object
  } catch (error) {
      console.error("Error fetching profile details:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};

// controllers/fasting.controller.js
// controller/user.controller.js
const getUserProfile = async (req, res) => {
  try {
    const { fullname, username, email, avatar } = req.user; // ✅ correct fields
    res.json({ fullname, username, email, avatar });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile" });
  }
};







// Helper to convert DD/MM/YYYY to Date object
function parseDate(input) {
  return new Date(input); // The input will already be in a valid ISO format
}

const addFastingData = async (req, res) => {
  try {
    const { startTime, endTime } = req.body;

    // Directly parse them
    const parsedStart = new Date(startTime);
    const parsedEnd = new Date(endTime);

    if (isNaN(parsedStart.getTime()) || isNaN(parsedEnd.getTime())) {
      return res.status(400).json({ message: "Invalid datetime format." });
    }

    const newFasting = new FastingModel({
      startTime: parsedStart,
      endTime: parsedEnd,
      userId: req.user?._id, // if auth exists
    });

    await newFasting.save();

    res.status(201).json({ message: "Fasting data added successfully", data: newFasting });
  } catch (error) {
    console.error("Error in addFastingData:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};









module.exports = {
  registeruser,
  loginuser,
  loggedout,
  refreshaccesstoken,
  changepassword,
  getcurrentuser,
  update,
  updateuseravatar,
  updateusercoverimage,
  profiledetails,
  addFastingData,
  getUserProfile
  
};
