import {Router} from 'express'
import { loginUser, registerUser } from '../controllers/users_controller.js'

const usuarios = Router()

usuarios.post('/users/register',registerUser)
usuarios.post('/users/login',loginUser)


export default usuarios