import { pool } from '../db.js';

export const getEmployees = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM employee');//selecciona todos los empleados de la tabla employee
        res.json(rows);//devuelve los empleados en formato json
    } catch (error) {
        res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
}
export const getEmployee = async (req, res) => { 
    

    try {
    
        const [rows] =  await pool.query('SELECT * FROM employee WHERE id = ?', [req.params.id])
    
        if(rows.length <=0) return res.status(404).json({message: 'Employee not found'})
       res.json(rows[0])
    } catch (error) {
        
        res.status(500).json({message: "Something went wrong. Please try again later."})
    }
   
}

export const createEmployee = async(req, res) => {
    const { name, age, salary } = req.body; //se obtienen los datos del empleado a crear desde el body de la peticion
    try {
      
        const [rows] = await pool.query('INSERT INTO employee (name,age, salary) VALUES  (?,?,?)', [name,age,salary]);
        res.send({ //devuelve el empleado creado
            id: rows.insertId, //devuelve el id del empleado creado
            name, 
            age,
            salary
        });
    } catch (error) {
        res.status(500).json({message: "Something went wrong. Please try again later."});
    }
}

export const updateEmployee = async (req, res) => {
    const { id } = req.params;
    const { name, age, salary } = req.body;
    try {
       //IFMULL es una funcion de mysql que permite actualizar solo los campos que se envian en la peticion
    
        const [result] = await pool.query('UPDATE employee SET name = IFNULL(?, name), age = IFNULL(?, age), salary = IFNULL(?, salary) WHERE id = ?', [name, age, salary, id]);
        console.log(result);
        if(result.affectedRows === 0) return res.status(404).json({message: 'Employee not found'});
        const [rows] = await pool.query('SELECT * FROM employee WHERE id = ?', [id]);
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({message: "Something went wrong. Please try again later."});
    }
}

export const deleteEmployee = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM employee WHERE id = ?', [req.params.id]);
        if (result.affectedRows <= 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({message: "Something went wrong. Please try again later."});
    }
}
/*
await pool.query(sql,[req.body.email], (err, data) => {
    if (err) return res.json({err: "Login failed"});
    if (data.length > 0){
        bcrypt.compare(req.body.password, data[0].password, (error, response) => {
            if (error) return res.json({err: "Password error"});
            if (response){ return res.json("Login success");}
            else { return res.json("Invalid password");}
        });
    } else {
        return res.json("Invalid email");
    }
 
});*/