//importar el modulo route de express
import { Router } from "express";
import { getAllPreguntas, getPreguntasByIdController, deletepreguntaController, createQuestion, updateQuestionController } from "../controllers/preguntas_controller.js";
import { verifytoken } from "../middleware/auth.js";

//crear la instancia de router
const preguntas = Router()

//GET
//Crear la ruta y la invocacion del controlador
// Publica
preguntas.get('/preguntas', getAllPreguntas)
//Publica
preguntas.get('/preguntas/:id', getPreguntasByIdController)

preguntas.delete('/preguntas/:id', verifytoken,deletepreguntaController)
// Post question
preguntas.post('/preguntas',verifytoken,createQuestion)
// Put question
preguntas.put('/preguntas/:id', verifytoken,updateQuestionController)
//exportar la variable router

export default preguntas