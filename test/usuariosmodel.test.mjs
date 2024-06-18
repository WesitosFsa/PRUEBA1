import { describe, it } from 'mocha';
import { strict as assert } from 'assert';
import bcrypt from 'bcrypt';
import fetch from 'node-fetch';
import usermodel from '../src/models/usuario.js';


describe('registerusermodel', function() {
    it('debería manejar correctamente errores durante el registro', async function() {
        const newUser = {
            username: 'usuarioExistente',
            password: 'password123'
        };

        // Mock de fetch para simular la petición POST que falla
        globalThis.fetch = async () => ({
            json: async () => {
                throw new Error('Username already exists'); // Simula un error durante el registro
            }
        });

        try {
            // Llama al modelo de registro
            await usermodel.registerusermodel(newUser);
            assert.fail('Se esperaba que lanzara un error');
        } catch (error) {
            // Verifica el comportamiento esperado
            assert.strictEqual(error.message, 'Username already exists');
        }

        // Limpia el mock de fetch
        delete globalThis.fetch;
    });
});


describe('loginusermodel', function() {
    it('deberia retornar el usuario con credenciales correctas', async function() {
        const username = 'usuario';
        const password = 'password123';
        // Mock de usuarios
        const mockUsers = [
            { username: 'usuario', password: await bcrypt.hash(password, 10) }
        ];
        // Mock de fetch
        globalThis.fetch = async () => ({
            json: async () => mockUsers
        });
        // Mock de bcrypt.compare
        const originalCompare = bcrypt.compare;
        bcrypt.compare = async (password, hash) => password === 'password123';
        // Llama al modelo
        const result = await usermodel.loginusermodel(username, password);
        // Verifica el comportamiento esperado
        assert.strictEqual(result.username, username);
        // Restaura los metodos originales
        bcrypt.compare = originalCompare;
        delete globalThis.fetch;
    });
    it('deberia retornar un error si el usuario no es encontrado', async function() {
        const username = 'usuarioNoExistente';
        const password = 'password123';
        // Mock de usuarios vacio
        const mockUsers = [];
        // Mock de fetch
        globalThis.fetch = async () => ({
            json: async () => mockUsers
        });
        // Mock de bcrypt.compare
        const originalCompare = bcrypt.compare;
        bcrypt.compare = async (password, hash) => false;
        // Llama al modelo
        const result = await usermodel.loginusermodel(username, password);
        // Verifica el comportamiento esperado
        assert.deepStrictEqual(result, { error: 'Username o password invalido' });
        // Restaura los metodos originales
        bcrypt.compare = originalCompare;
        delete globalThis.fetch;
    });
    it('deberia retornar un error si el password es incorrecto', async function() {
        const username = 'usuario';
        const password = 'passwordIncorrecta';
        // Mock de usuarios
        const mockUsers = [
            { username: 'usuario', password: await bcrypt.hash('password123', 10) }
        ];
        // Mock de fetch
        globalThis.fetch = async () => ({
            json: async () => mockUsers
        });
        // Mock de bcrypt.compare
        const originalCompare = bcrypt.compare;
        bcrypt.compare = async (password, hash) => false;
        // Llama al modelo
        const result = await usermodel.loginusermodel(username, password);
        // Verifica el comportamiento esperado
        assert.deepStrictEqual(result, { error: 'Username o password invalido' });
        // Restaura los metodos originales
        bcrypt.compare = originalCompare;
        delete globalThis.fetch;
    });
});