
const preguntasModel={
    async getAllPreguntas(){
        //: punto 1
         const peticion = await fetch('http://localhost:4000/preguntas')
         const tours = await peticion.json()
         //:punto 2
         return tours
     },
     async getPreguntasByIdmodel(id){
        // const url = `http://localhost:4000/preguntas/${id}`
        const response = await fetch(`http://localhost:4000/preguntas/${id}`)
        if (!response.ok){
            
            return{error: "Pregunta no encontrado"}
        }
        const data = await response.json()
        return data
    }
    ,
    async postPreguntas(newQuestion){
        const url = 'http://localhost:4000/preguntas'
        const peticion = await fetch(url,{
            method:"POST",
            body:JSON.stringify(newQuestion),
            headers:{'Content-Type':"application/json"}
    })
    const data = await peticion.json()
    return data
    }
    ,
    async updateQuestionByIdmodel(preguntasId, dataQuestion){
        const url = `http://localhost:4000/preguntas/${preguntasId}`
        const response = await fetch(url)
        if (!response.ok){
            return{error: "Pregunta no encontrada"}
        }else{
            const peticion = await fetch(url, {
                method: "PUT",
                body:JSON.stringify(dataQuestion),
                headers:{'Content-Type' : 'application/json'}
            })
            const data = await peticion.json()
            return data
        }
    }
    ,
    async Borrar_preguntasID(preguntasId){
        const url = `http://localhost:4000/preguntas/${preguntasId}`
        const response = await fetch(url)
        if (!response.ok){
            return{msg: "Pregunta no encontrada"}
        }else{
            const peticion = await fetch(url, {
                method: "DELETE",
            })
            
            await peticion.json()
            return {msg:"Pregunta eliminada correctamente"}
        }
    }
}

export default preguntasModel