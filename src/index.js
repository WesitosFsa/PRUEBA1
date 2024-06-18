// index.js

import app from './server.js';
import { exec } from 'child_process';

// Configuración del puerto
const PORT = process.env.PORT || 3000;  // Render asigna automáticamente `process.env.PORT`

// Iniciar el servidor principal en el puerto asignado por Render
app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);

    // Iniciar json-server en el puerto 4000 (puerto interno)
    const jsonServerPort = 4000; // Puerto interno para json-server
    const jsonServerProcess = exec(`json-server --watch db.json --port ${jsonServerPort}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error al iniciar json-server: ${error}`);
            return;
        }
        console.log(`json-server stdout: ${stdout}`);
        console.error(`json-server stderr: ${stderr}`);
    });

    jsonServerProcess.on('close', (code) => {
        console.log(`json-server process exited with code ${code}`);
    });
});
