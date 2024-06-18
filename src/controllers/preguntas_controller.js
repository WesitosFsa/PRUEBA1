import preguntasModel from "../models/preguntas.js"
import {v4 as uuidv4} from 'uuid'
import fs from "fs-extra"
import { v2 as cloudinary } from 'cloudinary'

const getAllPreguntas = async (req, res) =>{
    try{

        //invocar el metodo del modelo
        const preguntas = await preguntasModel.getAllPreguntas()
        //mandar la respuesta al frontend
        res.status(200).json(preguntas)
    }catch(error){
        res.status(500).json({msg : error.message})

    }
}
const getPreguntasByIdController = async (req, res) =>{
    try{
        const {id} = req.params
        const preguntas = await preguntasModel.getPreguntasByIdmodel(id)
        const status = preguntas.error ? 404 : 200
        res.status(status).json(preguntas)
    }catch(error){
        res.status(500).json({msg : error.message})
    }
}


const createQuestion = async (req, res) => {
    const newQuestionData = {
        id: uuidv4(),
        userId: req.user.id,
        ...req.body // SPREAD - REQ.BODY{}
    }

    try {
        // Subir imagen 
        if (req.files.imagen) {
            const cloudinaryImageResponse = await cloudinary.uploader.upload(req.files.imagen.tempFilePath, { folder: 'Preguntas' });
            newQuestionData.imagen = cloudinaryImageResponse.secure_url;
            newQuestionData.public_id_imagen = cloudinaryImageResponse.public_id;
            // Eliminar archivo temporal
            await fs.unlink(req.files.imagen.tempFilePath);
        }

        // subir pdf

        if (req.files.pdf) {
            const cloudinaryPdfResponse = await cloudinary.uploader.upload(req.files.pdf.tempFilePath, { folder: 'Preguntas', resource_type: 'raw' });
            newQuestionData.pdf = cloudinaryPdfResponse.secure_url;
            newQuestionData.public_id_pdf = cloudinaryPdfResponse.public_id;
            // Eliminar archivo temporal
            await fs.unlink(req.files.pdf.tempFilePath);
        }

        // Mandar a la BDD
        const preguntas = await preguntasModel.postPreguntas(newQuestionData);

        // Responder al usuario
        res.status(201).json(preguntas);

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

    
const deletepreguntaController = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const preguntaFind = await preguntasModel.getPreguntasByIdmodel(id);

        if (preguntaFind.userId !== userId) {
            return res.status(403).json({ msg: 'No tienes permisos para eliminar esta pregunta' });
        }

        // Eliminar imagen de Cloudinary si existe
        if (preguntaFind.public_id_imagen) {
            await cloudinary.uploader.destroy(preguntaFind.public_id_imagen);
        }

        // Eliminar PDF de Cloudinary si existe
        if (preguntaFind.public_id_pdf) {
            await cloudinary.uploader.destroy(preguntaFind.public_id_pdf, { resource_type: 'raw' });
        }

        // Eliminar la pregunta de la base de datos
        const preguntas = await preguntasModel.Borrar_preguntasID(id);
        const status = preguntas.error ? 404 : 200;

        // Responder al usuario
        res.status(status).json(preguntas);

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const updateQuestionController = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const preguntaFind = await preguntasModel.getPreguntasByIdmodel(id);

        if (!preguntaFind) {
            return res.status(404).json({ msg: 'Pregunta no encontrada' });
        }

        if (preguntaFind.userId !== userId) {
            return res.status(403).json({ msg: 'No tienes permisos para actualizar esta pregunta' });
        }

        const updateData = { ...req.body };

        if (req.files && req.files.imagen) {
            if (preguntaFind.public_id_imagen) {
                await cloudinary.uploader.destroy(preguntaFind.public_id_imagen);
            }
            const newImage = await cloudinary.uploader.upload(req.files.imagen.tempFilePath, { folder: 'Preguntas' });
            updateData.imagen = newImage.secure_url;
            updateData.public_id_imagen = newImage.public_id;
            await fs.unlink(req.files.imagen.tempFilePath);
        }

        if (req.files && req.files.pdf) {
            if (preguntaFind.public_id_pdf) {
                await cloudinary.uploader.destroy(preguntaFind.public_id_pdf, { resource_type: 'raw' });
            }
            const newPdf = await cloudinary.uploader.upload(req.files.pdf.tempFilePath, { folder: 'Preguntas', resource_type: 'raw' });
            updateData.pdf = newPdf.secure_url;
            updateData.public_id_pdf = newPdf.public_id;
            await fs.unlink(req.files.pdf.tempFilePath);
        }

        // Asegurarse de que `id` y `userId` no se actualicen en la base de datos
        delete updateData.id;
        delete updateData.userId;

        const updatedQuestion = await preguntasModel.updateQuestionByIdmodel(id, updateData);
        if (updatedQuestion.error) {
            return res.status(404).json(updatedQuestion);
        }

        res.status(200).json(updatedQuestion);
    } catch (error) {
        console.error(`Error updating question with id ${id}:`, error);
        res.status(500).json({ msg: error.message });
    }
};



export{
    getAllPreguntas,
    getPreguntasByIdController,
    deletepreguntaController,
    createQuestion,
    updateQuestionController
}