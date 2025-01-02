import { config } from 'dotenv'; //importa la libreria dotenv para poder leer las variables de entorno 

config(); //configura las variables de entorno para poder leerlas

export const PORT = process.env.PORT || 3000;
export const DB_USER = process.env.DB_USER || 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD || '';
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_DATABASE = process.env.DB_DATABASE || 'EFC';
export const DB_PORT = process.env.DB_PORT_DB || 3308;




