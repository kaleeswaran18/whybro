const registeration = require('../Models/registeration')
const bcrypt = require("bcryptjs"); 

const registerationcontrl = () => {
    const signup = async (req, res) => {        
        try {
            console.log(req.body,"**********")
            let userexist = await registeration.find({ email: req.body.email })
            if (userexist.length != 0)
                return res.status(400).send({ error: 'Email does not exists! This email already registered!' })
            const salt = await bcrypt.genSalt(10)
            const hassedpassword = await bcrypt.hash(req.body.password, salt)
            console.log(req.body,"mxbshxbhsxbahkxb")
            const data = await registeration.create({
                name: req.body.name,
                email: req.body.email,
                password: hassedpassword,
            })
            data.save()
            res.status(200).send({                
                msg: "New user registered successfully!",
                data: data
            })
        }
        catch (err) {
            res.status(501).send("something went wrong!!!")
        }
    }
    const signin = async (req,res) => {
        try{
            let userexist = await registeration.findOne({email:req.body.email})
            console.log(userexist,"********#########")
            if(!userexist)
            return res.status(400).send({ error: 'Email is not found, Please Enter valid Email!' })

            console.log(req.body.password,">>>>>>>")
            console.log(userexist.password,"<<<<<<<<<")


            const validpswd = await bcrypt.compare( req.body.password,userexist.password);
            if(!validpswd)
            return res.status(400).send({err:"Invalid password, Please enter valid password"})
            console.log(userexist,"??????????")

            let useractive = await registeration.updateOne({_id:userexist._id},
                {
                    $set:{
                        userlogin:"Active"
                    }
                })
                // let active = await registeration.find({_id:userexist._id})
                
console.log(useractive,"xhgsahxgsahx")
            res.status(200).send({
                status:true,
                msg:"User Loggedin Successfully!",
                user:userexist             
            })
        }catch(err){
            res.status(501).send("Something went wrong!!!")
        }
    }
    return {
        signup, signin
    }
}
module.exports = registerationcontrl()