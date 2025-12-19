const mongoose = require("mongoose")
require("dotenv").config()
mongoose.connect(process.env.CONNECTION_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
 })
if(mongoose.connect){
    console.log("Database Connected Successfully!")

}else{
    console.log(err)
}