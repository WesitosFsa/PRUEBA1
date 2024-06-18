// test/preguntasModel.test.mjs
import { describe, it } from 'mocha';
import { strict as assert } from 'assert';
import preguntasModel from '../src/models/preguntas.js';

describe('getAllPreguntas', function() {
    it('deberia obtener todas las preguntas', async function() {
        // Mock de fetch para simular la respuesta de la API
        const mockResponse = [{ id: 1, pregunta: 'Esta funcionando la pregunta?' }];
        const mockFetch = async () => ({
            json: async () => mockResponse
        });

        // Sobreescribe fetch con el mock para la prueba
        globalThis.fetch = mockFetch;

        // Llama a la función y verifica el resultado
        const result = await preguntasModel.getAllPreguntas();
        assert.deepStrictEqual(result, mockResponse);
    });
});
describe('getPreguntasByIdmodel', function() {
    it('deberia obtener la pregunta por ID existente', async function() {
        // ID de ejemplo para la prueba
        const id = 1;
        // Respuesta simulada de la API para el ID dado
        const mockResponse = { id: 1, pregunta: 'Esta funcionando la pregunta?' };
        // Funcion mock de fetch para simular la respuesta de la API
        const mockFetch = async (url) => {
            assert.strictEqual(url, `http://localhost:4000/preguntas/${id}`);
            return {
                ok: true,
                json: async () => mockResponse
            };
        };
        // Sobreescribe fetch con el mock para la prueba
        globalThis.fetch = mockFetch;
        // Llama a la funcion y verifica el resultado
        const result = await preguntasModel.getPreguntasByIdmodel(id);
        assert.deepStrictEqual(result, mockResponse);
    });
    it('deberia manejar correctamente cuando la pregunta no es encontrada', async function() {
        // ID de ejemplo para la prueba
        const id = 999; // ID que simulará una pregunta no encontrada
        // Funcion mock de fetch para simular la respuesta de la API
        const mockFetch = async (url) => {
            assert.strictEqual(url, `http://localhost:4000/preguntas/${id}`);
            return {
                ok: false
            };
        };
        // Sobreescribe fetch con el mock para la prueba
        globalThis.fetch = mockFetch;
        // Llama a la funcion y verifica el resultado
        const result = await preguntasModel.getPreguntasByIdmodel(id);
        assert.deepStrictEqual(result, { error: "Pregunta no encontrado" });
    });
});
describe('postPreguntas', function() {
    it('debería enviar una nueva pregunta', async function() {
        // Mock de fetch para simular la respuesta de la API
        const mockResponse = { id: 1, pregunta: '¿Cómo hacer pruebas unitarias?' };
        const mockFetch = async () => ({
            json: async () => mockResponse
        });

        // Sobreescribe fetch con el mock para la prueba
        globalThis.fetch = mockFetch;

        // Datos de la nueva pregunta
        const newQuestion = { pregunta: '¿Cómo hacer pruebas unitarias?' };

        // Llama a la función y verifica el resultado
        const result = await preguntasModel.postPreguntas(newQuestion);
        assert.deepStrictEqual(result, mockResponse);
    });
});

describe('updateQuestionByIdmodel', function() {
    it('deberia actualizar la pregunta por ID existente', async function() {
        // ID de ejemplo para la prueba
        const preguntasId = 1;
        const dataQuestion = { pregunta: '¿Esta funcionando la pregunta actualizada?' };
        // Respuesta simulada de la API para la primera llamada fetch (verificacion de existencia)
        const mockResponseExists = { id: 1, pregunta: '¿Esta funcionando la pregunta?' };
        // Respuesta simulada de la API para la segunda llamada fetch (actualizacion)
        const mockResponseUpdate = { id: 1, pregunta: '¿Esta funcionando la pregunta actualizada?' };
        // Funcion mock de fetch para simular la respuesta de la API
        const mockFetch = async (url, options) => {
            if (options && options.method === 'PUT') {
                // Segunda llamada (actualización)
                assert.strictEqual(url, `http://localhost:4000/preguntas/${preguntasId}`);
                assert.strictEqual(options.body, JSON.stringify(dataQuestion));
                return {
                    ok: true,
                    json: async () => mockResponseUpdate
                };
            } else {
                // Primera llamada (verificacion de existencia)
                assert.strictEqual(url, `http://localhost:4000/preguntas/${preguntasId}`);
                return {
                    ok: true,
                    json: async () => mockResponseExists
                };
            }
        };
        // Sobreescribe fetch con el mock para la prueba
        globalThis.fetch = mockFetch;
        // Llama a la funcion y verifica el resultado
        const result = await preguntasModel.updateQuestionByIdmodel(preguntasId, dataQuestion);
        assert.deepStrictEqual(result, mockResponseUpdate);
    });
    it('debería manejar correctamente cuando la pregunta no es encontrada', async function() {
        // ID de ejemplo para la prueba
        const preguntasId = 999; // ID que simulara una pregunta no encontrada
        const dataQuestion = { pregunta: 'Esta funcionando la pregunta actualizada?' };
        // Funcion mock de fetch para simular la respuesta de la API (primera llamada)
        const mockFetch = async (url) => {
            assert.strictEqual(url, `http://localhost:4000/preguntas/${preguntasId}`);
            return {
                ok: false
            };
        };
        // Sobreescribe fetch con el mock para la prueba
        globalThis.fetch = mockFetch;
        // Llama a la funcion y verifica el resultado
        const result = await preguntasModel.updateQuestionByIdmodel(preguntasId, dataQuestion);
        assert.deepStrictEqual(result, { error: "Pregunta no encontrada" });
    });
});

describe('Borrar_preguntasID', function() {
    it('deberia eliminar la pregunta por ID existente', async function() {
        // ID de ejemplo para la prueba
        const preguntasId = 1;
        // Respuesta simulada de la API para la primera llamada fetch (verificacion de existencia)
        const mockResponseExists = { id: 1, pregunta: 'Esta funcionando la pregunta?' };
        // Respuesta simulada de la API para la segunda llamada fetch (eliminación)
        const mockResponseDelete = { msg: 'Pregunta eliminada correctamente' };
        // Funcion mock de fetch para simular la respuesta de la API
        const mockFetch = async (url, options) => {
            if (options && options.method === 'DELETE') {
                // Segunda llamada (eliminacion)
                assert.strictEqual(url, `http://localhost:4000/preguntas/${preguntasId}`);
                return {
                    ok: true,
                    json: async () => mockResponseDelete
                };
            } else {
                // Primera llamada (verificacion de existencia)
                assert.strictEqual(url, `http://localhost:4000/preguntas/${preguntasId}`);
                return {
                    ok: true,
                    json: async () => mockResponseExists
                };
            }
        };
        // Sobreescribe fetch con el mock para la prueba
        globalThis.fetch = mockFetch;
        // Llama a la funcion y verifica el resultado
        const result = await preguntasModel.Borrar_preguntasID(preguntasId);
        assert.deepStrictEqual(result, mockResponseDelete);
    });
    it('deberia manejar correctamente cuando la pregunta no es encontrada', async function() {
        // ID de ejemplo para la prueba
        const preguntasId = 999; // ID que simulara una pregunta no encontrada
        // Funcion mock de fetch para simular la respuesta de la API (primera llamada)
        const mockFetch = async (url) => {
            assert.strictEqual(url, `http://localhost:4000/preguntas/${preguntasId}`);
            return {
                ok: false
            };
        };
        // Sobreescribe fetch con el mock para la prueba
        globalThis.fetch = mockFetch;
        // Llama a la funcion y verifica el resultado
        const result = await preguntasModel.Borrar_preguntasID(preguntasId);
        assert.deepStrictEqual(result, { msg: "Pregunta no encontrada" });
    });
});
