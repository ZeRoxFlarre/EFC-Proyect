import app from './app.js' //importa el archivo app.js
import {PORT} from './config.js' //importa el archivo config.js

app.listen(PORT) //se pone a escuchar el servidor en el puerto 3000
console.log('Server on port', PORT) //se imprime en consola que el servidor esta corriendo en el puerto 3000