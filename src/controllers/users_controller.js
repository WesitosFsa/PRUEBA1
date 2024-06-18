import usermodel from "../models/usuario.js"
import { v4 as uuidv4 }  from 'uuid'
import bcrypt from "bcrypt"
import { createToken } from "../middleware/auth.js"
import { token } from "morgan"

const registerUser = async(req, res)=> {
    const { password, ...otherdatauser } = req.body
    const hashedpassword = await bcrypt.hash(password, 10);
    const userdata = {
        id: uuidv4(),
        password: hashedpassword,
        ...otherdatauser
    }
    try {
        //:punto 2
        const user = await usermodel.registerusermodel(userdata)
        //:punto 3
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({msg : error.message})
    }
}

const loginUser = async(req, res)=> {
    const{username,password}= req.body
    try {
        const user = await usermodel.loginusermodel(username,password)
        if (user && password) {
            const token =createToken(user)
            delete user.password
            res.status(200).json({user,token})
            
        }
        
            
    } catch (error) {
        res.status(500).json({msg : error.message})
    }
}


export{
    registerUser,
    loginUser
}