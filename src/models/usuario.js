import bcrypt from "bcrypt"
const usermodel={
    async registerusermodel(newUser){
        const url = "http://localhost:4000/users"
        const peticion = await fetch(url,{
            method:'POST',
            body:JSON.stringify(newUser),
            headers:{'Content-Type':'application/json'}
        })
        const data = await peticion.json()
        return data
    }
    ,
    async loginusermodel(username,password){
        const response = await fetch(`http://localhost:4000/users`)
        const users = await response.json()
        const user = users.find(user => user.username === username)
        if (!user) {
            return { error: "Username o password invalido" }
        }
        const passwordmatch = await bcrypt.compare(password, user.password)
        if (user && passwordmatch) {
            return user
        } else {
            return {error:"Username o password invalido"}
        }
    }
}

export default usermodel