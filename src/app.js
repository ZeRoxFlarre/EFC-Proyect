import express from 'express'; //se importa el modulo express
//import employeesRoutes from './routes/employees.routes.js' //se importa el archivo de rutas
import EFC_routes from './routes/EFC.routes.js' //se importa el archivo de rutas
import multer from 'multer'; //se importa el modulo multer
import path from 'path'; //se importa el modulo path

const app = express(); //se crea el servidor

app.use(express.json()) //para que el servidor entienda los datos que le envian en formato json

// app.use('/api', employeesRoutes) //donde recibe la peticion de la ruta /api/employee que fue creada en el archivo employees.routes.js
app.use('/api', EFC_routes) //donde recibe la peticion de la ruta /api/EFC_client que fue creada en el archivo EFC.routes.js

app.use((req, res, next) => { //middleware para manejar errores 
    res.status(404).json({ message: "Not found" }); //si no se encuentra la ruta devuelve un mensaje de error 404 
  } );

export default app; //se exporta el servidor para poder ser usado en otros archivos
