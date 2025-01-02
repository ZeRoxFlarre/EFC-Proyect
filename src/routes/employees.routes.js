import { Router } from "express";
import { getEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee } from '../controllers/employees.controller.js';


const router = Router();

router.get('/employee', getEmployees); // donde se hace la peticion directamente a la ruta /employee
router.get('/employee/:id', getEmployee); // donde se hace la peticion directamente a la ruta /employee/:id donde :id es el id del empleado
router.post('/employee', createEmployee);
router.patch('/employee/:id', updateEmployee);
router.delete('/employee/:id', deleteEmployee);

export default router;