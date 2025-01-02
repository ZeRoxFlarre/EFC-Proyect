import { Router } from "express";
import { getEFC_clientByEmail, Post_client, updateEFC_client, deleteEFC_client, ResendOTP, VerifyEmail, deleteUser, LoginUser, 
  postRegistroCliente, getClients, getClientsReport, Client_Change, ChangePassword, getAllProducts,updateProduct, addProduct,
   getAllActivity, addActivity, updateActivity, deleteActivity,getAllSchedules,updateSchedules, getAllPersonal,
   addPersonalInfo, updatePersonalInfo,getTimestampsById,getIDByEmail, getChestExercises, getBackExercises, getShoulderExercises, getBicepExercises, getTricepExercises, 
   getLegExercises, updateExercise, getAllExercises, addExercise, getClientById, LoginEmployee, getEmployee, addChangeToHistory, changeToHistory, getEmployees, addEmployee, updateEmployee} from '../controllers/EFC_client.controller.js';

const router = Router();

//admin
router.post('/EFC_clients', Post_client); // donde se hace la peticion directamente a la ruta /EFC_client/email/password para verificar el email y la contraseña
router.post('/EFC_client/Verify', VerifyEmail);
router.delete('/EFC_client/delete', deleteUser);

router.post('/EFC_client', ResendOTP); 
router.patch('/EFC_client/:id', updateEFC_client);
router.delete('/EFC_client/:id', deleteEFC_client);

router.post('/RegistroCliente/Register', postRegistroCliente); // donde se hace la peticion directamente a la ruta /EFC_client para registrar un cliente
router.get('/EFC_client/Report', getClientsReport); //reporte de clientes registradosQRcodes
router.get('/EFC_clientFind/:id', getClientById); //  donde se hace la peticion directamente a la ruta /EFC_client/:id para obtener un cliente por su id

router.post('/EFC_client/LoginEmployee', LoginEmployee); // donde se hace la peticion directamente a la ruta /EFC_client/email/password para verificar el email y la contraseña
router.get('/EFC_client/getEmployee/:id', getEmployee); //reporte de clientes registradosQRcodes
//router.post('/EFC_client/addProduct', upload.single('imagen'), addProduct);

router.put('/EFC_client/updateProduct/:id', updateProduct); //reporte de clientes registradosQRcodes
router.post('/EFC_client/addProduct', addProduct); //anadir producto

router.put('/EFC_client/updateActivity/:id', updateActivity); 
router.delete('/EFC_client/deleteActivity/:id', deleteActivity); 

router.get('/EFC_client/getAllSchedules', getAllSchedules);
router.put('/EFC_client/updateSchedules/:id', updateSchedules); 

router.get('/EFC_client/getAllPersonal', getAllPersonal); //  donde se hace la peticion directamente a la ruta /EFC_client/:id para obtener un cliente por su id
router.post('/EFC_client/addPersonalInfo', addPersonalInfo); //  donde se hace la peticion directamente a la ruta /EFC_client/:id para obtener un cliente por su id
router.put('/EFC_client/updatePersonalInfo/:id', updatePersonalInfo);

router.get('/EFC_client/getTimestampsById/:id',  getTimestampsById ); //  donde se hace la peticion directamente a la ruta /EFC_client/:id para obtener un cliente por su id
router.get('/EFC_client/getIDByEmail/:email',  getIDByEmail ); //  donde se hace la peticion directamente a la ruta /EFC_client/:id para obtener un cliente por su id
//client
router.post('/EFC_client/Login', LoginUser);

router.get('/EFC_client/getAllProducts', getAllProducts); //reporte de clientes registradosQRcodes

router.get('/EFC_client/getAllActivity', getAllActivity); 


router.post('/EFC_client/addActivity', addActivity); //anadir producto
router.post('/EFC_client/Change', Client_Change); // cambiar contraseña enviando otp
router.post('/EFC_client/ChangePassword', ChangePassword); // cambiar contraseña enviando otp

router.get('/EFC_client/Clients', getEFC_clientByEmail); // donde se hace la peticion directamente a la ruta /EFC_client
router.post('/EFC_client/History/:clientId/:employeeId', addChangeToHistory); // donde se hace la peticion directamente a la ruta /EFC_client
router.post('/EFC_client/changeHistory/:employeeId', changeToHistory);

router.get('/EFC_client/getEmployees', getEmployees); //  donde se hace la peticion directamente a la ruta /EFC_client/:id para obtener un cliente por su id
router.post('/EFC_client/addEmployee', addEmployee); //  donde se hace la peticion directamente a la ruta /EFC_client/:id para obtener un cliente por su id
router.put('/EFC_client/updateEmployee/:id', updateEmployee); //  donde se hace la peticion directamente a la ruta /EFC_client/:id para obtener un cliente por su id
//Exercise Routes

router.get('/Exercise/getChestExercises', getChestExercises);
router.get('/Exercise/getBackExercises', getBackExercises);
router.get('/Exercise/getShoulderExercises', getShoulderExercises);
router.get('/Exercise/getBicepExercises', getBicepExercises);
router.get('/Exercise/getTricepExercises', getTricepExercises);
router.get('/Exercise/getLegExercises', getLegExercises);


//Edit Exercise Routes


router.get('/Exercise/getAllExercises', getAllExercises); //  donde se hace la peticion directamente a la ruta /
router.put('/Exercise/updateExercise/:ID', updateExercise);
router.post('/Exercise/addExercise', addExercise);

////////////////////////  
router.put('/EFC_client/Update/:id', updateEFC_client);
router.get('/EFC_client/ClientsUpdate', getClients); //  donde se hace la peticion directamente a la ruta /EFC_client/:id para obtener un cliente por su id
export default router;