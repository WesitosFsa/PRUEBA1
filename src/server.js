
import express from 'express'
import morgan from 'morgan'
import cloudinary from 'cloudinary'
import dotenv from 'dotenv'
import preguntas from './routers/preguntas_routers.js'
import usuarios from './routers/users_routers.js'
import fileUpload from 'express-fileupload'

dotenv.config()

const app = express()
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : './uploads'
}));


app.use(morgan('dev'))

app.set('port',process.env.port || 3000)

app.use(express.json())

app.get('/',(req,res)=>res.send("Server on"))
//resgistrar las rutas de tour
app.use('/api/v1',preguntas)
app.use('/api/v1',usuarios)



export default app