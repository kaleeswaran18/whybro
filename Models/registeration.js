const mongoose = require("mongoose")

const schema = mongoose.Schema;
const userschema = new schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    Date:{
        type:Date,
        default:Date.now()
    },
    userlogin:{
        type:String,
        default:"Inactive"
    }
})

module.exports = registeration = mongoose.model("users",userschema)