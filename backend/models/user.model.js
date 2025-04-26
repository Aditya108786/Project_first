//
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const userschema = mongoose.Schema({
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

    },
    fullname:{
        type:String,
        required:true,

    },
    avatar:{
        type:String,
        

    },
    coverimage:{
        type:String
    },
    watchaHistory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"video"
    },
    password:{
        type:String,
        required:[true, 'password is required']

    },
    refreshToken:{
        type:String
    }
    
},{
   timestamps:true
}
)
userschema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcryptjs.hash(this.password, 10)  //hook
     next()
    

})

userschema.methods.isPasswordCorrect = async function(password){  //
  return await bcryptjs.compare(password, this.password)
}

userschema.methods.generateaccesstoken = function(){
     return  jwt.sign({_id:this._id,
        email:this.email,
        username:this.username,                       
        fullname:this.fullname
       },process.env.ACCESS_TOKEN_SECRET,
    {
       expiresIn:process.env.ACCESS_TOKEN_EXPIRY 
    })
}

userschema.methods.generaterefreshtoken = function(){
   return  jwt.sign({
         _id : this._id
     }, process.env.REFRESH_TOKEN_SECRET,
     {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
     }
    )

}

module.exports = mongoose.model("user", userschema)