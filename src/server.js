// server.js

import express from 'express';
import morgan from 'morgan';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import preguntas from './routers/preguntas_routers.js';
import usuarios from './routers/users_routers.js';
import fileUpload from 'express-fileupload';
import { exec } from 'child_process';

// Cargar variables de entorno
dotenv.config();

const app = express();

// Configuración de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Middleware para subir archivos
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads'
}));

// Middleware de logging
app.use(morgan('dev'));

// Middleware para parsear JSON
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => res.send("Server on"));

// Registro de rutas
app.use('/api/v1', preguntas);
app.use('/api/v1', usuarios);

// Exportar la aplicación de Express
export default app;
