import { pool } from '../db.js';
import sendEmail from '../utils/nodemailer.cjs';
import generateOTP from '../utils/otp.generator.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const getEmployee = async (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM `Employee` WHERE id = ?';

  try {
      // Obtiene una conexión de la piscina
      const connection = await pool.getConnection();

      // Ejecuta la consulta SQL con el ID proporcionado
      const [rows] = await connection.query(sql, [id]);
      connection.release(); // Libera la conexión después de usarla

      if (rows.length > 0) {
          // Si se encontró el empleado, envía su información como respuesta
          res.status(200).json(rows[0]);
      } else {
          // Si no se encontró ningún empleado con ese ID, envía un mensaje de error
          res.status(404).json({ message: 'Empleado no encontrado' });
      }
  } catch (error) {
      // Si hay un error en la consulta SQL, envía un mensaje de error
      res.status(500).json({ message: 'Error al buscar empleado', error: error.message });
  }
};
export const getEmployees = async (req, res) => {
  try {
      const [rows] = await pool.query('SELECT id, first_name, last_name, password, category FROM Employee');
      res.json(rows);
  } catch (error) {
      res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
}


export const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, password, category } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE Employee SET first_name = ?, last_name = ?, password = ?, category = ? WHERE id = ?',
      [first_name, last_name, password, category, id]
    );

    console.log(result);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({ message: 'Employee updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
}

export const addEmployee = async (req, res) => {
  const { first_name, last_name, password, category } = req.body;
  if (!first_name || !last_name || !password || category === undefined) {
    return res.status(400).json({ error: 'first_name, last_name, password, and category are required to add an employee' });
  }

  try {
    const connection = await pool.getConnection();
    await connection.query('INSERT INTO Employee (first_name, last_name, password, category) VALUES (?, ?, ?, ?)', [first_name, last_name, password, category]);
    connection.release();
    res.status(201).json({ message: 'Employee added successfully' });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ error: 'An error occurred while adding the employee' });
  }
};
///////////Employee

export const LoginEmployee = async (req, res) => {
  const { id, password } = req.body;

  // Realizar una consulta SQL para buscar el id y validar el password
  const query = `SELECT id, password, first_name, last_name, category FROM Employee WHERE id = ? AND password = ?`;
  
  try {
      // Ejecutar la consulta utilizando el id y la contraseña proporcionados
      const [result] = await pool.query(query, [id, password]);
    
      if (result.length > 0) {
          // Si se encuentra una fila con el id y contraseña proporcionados
          
          // Devuelve solo los datos del usuario encontrado sin incluir la contraseña
          const user = {
              id: result[0].id,
              first_name: result[0].first_name,
              last_name: result[0].last_name,
              category: result[0].category
          };
          res.status(200).json(user);
      } else {
          // Si no se encuentra ninguna fila con el id y contraseña proporcionados, devolver un mensaje de error
          res.status(404).json({ message: "Invalid credentials" });
      }
  } catch (error) {
      // Manejar cualquier error que pueda ocurrir durante la ejecución de la consulta
      console.error("Error retrieving user data:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};

///////////Employee
  
export const Post_client = async (req, res) => { 
    const { email, first_name, last_name, category, phone } = req.body;
    const sql = 'SELECT * FROM `EFC_client` WHERE email = ?';

    try {
        const [rows] = await pool.query(sql, [email]);
        if (rows.length > 0) {
            // Si el usuario ya existe, devuelve un mensaje indicándolo
            console.log('User already exists');
            return res.status(400).json({ message: 'User already exists' });
        } else {
            // Si el usuario no existe, inserta un nuevo registro en la tabla EFC_client
            const confirmationCode = generateOTP(); // Genera el código aleatorio
            const hashedOTP = await bcrypt.hash(confirmationCode, 10); // Hashea el OTP antes de almacenarlo en la base de datos
            
            // Genera un token JWT para el OTP con una duración de 1 hora
            const token = generateToken(confirmationCode);

            const insertSql = 'INSERT INTO `EFC_client` (email, first_name, last_name, category, phone, password, otp_code) VALUES (?, ?, ?, ?, ?, ?, ?)';
            await pool.query(insertSql, [email, first_name, last_name, category, phone, token, hashedOTP]);
            console.log('EFC_client created');

            const subject = 'Email Verification';
            const message = `Your OTP code is: ${confirmationCode}. Use this code to verify your email.`;
    
            sendEmail(email, subject, message);

            return res.json({ message: 'EFC_client created', token }); // Retorna el token JWT junto con el mensaje de creación del cliente
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};

// Función para generar el token JWT basado en el OTP con una duración de 1 hora
function generateToken(otp) {
    // Define el secreto que se utilizará para firmar el token
    const secret = 'mi_secreto_super_secreto';

    // Firma el token JWT utilizando el código OTP y el secreto con una duración de 1 hora
    const token = jwt.sign({ otp }, secret, { expiresIn: '1h' });

    // Retorna el token generado
    return token;
}


export const ResendOTP = async (req, res) => {
    const { email } = req.body;
    const sql = 'SELECT * FROM `EFC_client` WHERE email = ?';
    console.log(req.body);
    try {
        const [rows] = await pool.query(sql, [email]);
        if (rows.length > 0) {
            // El correo electrónico ya existe, puedes generar y enviar el OTP aquí
            let confirmationCode = generateOTP(); // Genera el código aleatorio

            // Hashea el OTP antes de almacenarlo en la base de datos
            const hashedOTP = await bcrypt.hash(confirmationCode, 10);

            // Actualiza el token OTP en la base de datos
            const updateSql = 'UPDATE `EFC_client` SET otp_code = ? WHERE email = ?';
            await pool.query(updateSql, [hashedOTP, email]);
            
            // Envía el OTP al correo electrónico
            const subject = 'Email Verification';
            const message = `Your OTP code is: ${confirmationCode}`;
            sendEmail(email, subject, message);

            res.json({ message: 'OTP sent successfully' });
        } else {
            // El correo electrónico no existe en la base de datos
            res.status(404).json({ message: 'Email not found' });
        }
    } catch (error) {
        // Manejo de errores
        console.error('Error:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
}


export const VerifyEmail = async (req, res) => {
   const { email, otp_code, first_name, last_name, category, phone, password } = req.body;
const sql = 'SELECT * FROM `EFC_client` WHERE email = ?';

try {
    const [rows] = await pool.query(sql, [email]);

    // Verificar si el correo electrónico existe en la base de datos
    if (rows.length <= 0) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Obtener el código OTP almacenado en la base de datos para el usuario correspondiente
    const storedOTP = rows[0].otp_code;

    // Verificar el código OTP proporcionado con el almacenado en la base de datos
    const isOTPValid = await bcrypt.compare(otp_code, storedOTP);

    if (!isOTPValid) {
        return res.status(400).json({ message: 'OTP is invalid' });
    }

    // Generar el hash de la contraseña para actuar como "token"
    const hashedPassword = await bcrypt.hash(password, 10);

    // Actualizar la información del usuario, incluyendo el hash de la contraseña
    const updateSql = 'UPDATE `EFC_client` SET first_name = ?, last_name = ?, category = ?, phone = ?, password = ? WHERE email = ?';
    await pool.query(updateSql, [first_name || null, last_name || null, category || null, phone || null, hashedPassword, email]);

    return res.status(200).json({ message: 'Email is verified and user information updated' });
} catch (error) {
    return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
}

};


export const deleteUser = async (req, res) => {
    const { email } = req.body;
    const sql = 'DELETE FROM `EFC_client` WHERE email = ?';

    try {
        await pool.query(sql, [email]);
        return res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};

export const postRegistroCliente = async (req, res) => { //QRScan
    const { id} = req.body;

    try {
        // Insertar los datos del cliente en la tabla RegistroCliente junto con la fecha y hora actual
        await pool.query('INSERT INTO RegistroCliente (id, timestamp) VALUES (?, NOW())',
            [id]);

        // Envía una respuesta exitosa si se inserta correctamente
        res.status(201).json({ message: 'Cliente registrado correctamente en RegistroCliente' });
    } catch (error) {
        // Manejo de errores
        console.error(error);
        res.status(500).json({ message: 'Error al procesar la solicitud. Por favor, inténtalo de nuevo más tarde.' });
    }
};

export const getEFC_clientByEmail = async (req, res) => {
    const { email } = req.query; // Obtiene el correo electrónico de la consulta
    try {
        const [rows] = await pool.query('SELECT ID, first_name, last_name, email, category , phone, membership_status, start_date, end_date FROM EFC_client WHERE email = ?', [email]);
        if (rows.length > 0) {
            res.json(rows[0]); // Devuelve el primer resultado (debería ser único por correo electrónico)
        } else {
            res.status(404).json({ message: "Cliente no encontrado." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Algo salió mal. Por favor, inténtalo de nuevo más tarde." });
    }
}

export const updateEFC_client = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, phone, category, membership_status, start_date, end_date } = req.body;
  
  try {
    // Parsear las fechas en formato ISO 8601 a formato de fecha MySQL (YYYY-MM-DD)
    const formattedStartDate = new Date(start_date).toISOString().split('T')[0];
    const formattedEndDate = new Date(end_date).toISOString().split('T')[0];

    // Convertir el estado de membresía a booleano
    const membershipStatusBoolean = membership_status === 'Active' ? 1 : 0;

    // Convertir la categoría a su representación numérica
    let categoryValue;
    if (category === 'Student') {
      categoryValue = 1;
    } else if (category === 'Faculty') {
      categoryValue = 2;
    } else {
      categoryValue = 0;
    }

    const [result] = await pool.query(
      'UPDATE EFC_client SET first_name = ?, last_name = ?, email = ?, phone = ?, category = ?, membership_status = ?, start_date = ?, end_date = ? WHERE id = ?',
      [first_name, last_name, email, phone, categoryValue, membershipStatusBoolean, formattedStartDate, formattedEndDate, id]
    );

    console.log(result);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'EFC_client not found' });
    }

    res.json({ message: 'Client updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
};

import moment from 'moment'; // Importar moment.js

export const addChangeToHistory = async (req, res) => {
  try {
    const { employeeId } = req.params;
    let { changeTime } = req.body;

    // Verificar si el ID de empleado es válido
    const employee = await pool.query('SELECT * FROM Employee WHERE id = ?', [employeeId]);
    if (employee.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Analizar la cadena de fecha y hora en un objeto de momento con el formato proporcionado
    changeTime = moment(changeTime, 'MM/DD/YYYY, h:mm:ss A').format('YYYY-MM-DD HH:mm:ss');

    // Insertar una nueva entrada en la tabla de historial de cambios
    await pool.query(
      'INSERT INTO Change_History (Employee_ID, ChangeTime) VALUES (?, ?)',
      [employeeId, changeTime]
    );

    // Devolver una respuesta exitosa
    res.json({ message: 'Change added to history successfully' });
  } catch (error) {
    // Manejo de errores
    console.error('Error adding change to history:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Función controladora para agregar un cambio al historial
export const changeToHistory = async (req, res) => {
  try {
    const { employeeId } = req.params; // Obtener el ID del empleado de los parámetros de la URL
    let { changeTime } = req.body;

    // Verificar si el ID de empleado es válido
    const employee = await pool.query('SELECT * FROM Employee WHERE id = ?', [employeeId]);
    if (employee.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Analizar la cadena de fecha y hora en un objeto de momento con el formato proporcionado
    changeTime = moment(changeTime, 'MM/DD/YYYY, h:mm:ss A').format('YYYY-MM-DD HH:mm:ss');

    // Insertar una nueva entrada en la tabla de historial de cambios
    await pool.query(
      'INSERT INTO Change_History (Employee_ID, ChangeTime) VALUES (?, ?)',
      [employeeId, changeTime]
    );

    // Devolver una respuesta exitosa
    res.json({ message: 'Change added to history successfully' });
  } catch (error) {
    // Manejo de errores
    console.error('Error adding change to history:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};




// En tu controlador de productos
export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { nombre, precio } = req.body;
  
    if (!nombre || !precio) {
      return res.status(400).json({ message: 'Nombre y precio son campos obligatorios' });
    }
  
    try {
      const updateSql = 'UPDATE Productos SET nombre = ?, precio = ? WHERE id = ?';
      await pool.query(updateSql, [nombre, precio, id]);
  
      return res.status(200).json({ message: 'Producto actualizado correctamente' });
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      return res.status(500).json({ message: 'Ocurrió un error. Por favor, inténtalo de nuevo más tarde.' });
    }
  };
  
  export const getAllProducts = async (req, res) => {
    try {
      const selectSql = 'SELECT * FROM Productos';
      const [rows] = await pool.query(selectSql);
  
      console.log('Productos obtenidos correctamente');
      return res.status(200).json(rows);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      return res.status(500).json({ message: 'Ocurrió un error al obtener los productos' });
    }
  };
  
  export const addProduct = async (req, res) => {
    const { nombre, precio } = req.body;
    if (!nombre || !precio) {
      return res.status(400).json({ error: 'Se requiere nombre y precio para agregar un producto' });
    }
  
    try {
      const connection = await pool.getConnection();
      await connection.query('INSERT INTO Productos (nombre, precio) VALUES (?, ?)', [nombre, precio]);
      connection.release();
      res.status(201).json({ message: 'Producto agregado correctamente' });
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      res.status(500).json({ error: 'Ocurrió un error al agregar el producto' });
    }
  };
//Activity
export const getAllActivity = async (req, res) => {
  try {
    const selectSql = 'SELECT * FROM `Activity`';
    const [rows] = await pool.query(selectSql);

    console.log('Productos obtenidos correctamente');
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener los actividades:', error);
    return res.status(500).json({ message: 'Ocurrió un error al obtener los actividades' });
  }
};
export const addActivity = async (req, res) => {
  const { Event_Name, Activity_Date, Location } = req.body;
  if (!Event_Name || !Activity_Date || !Location) {
    return res.status(400).json({ error: 'Se requiere Event_Name, Activity_Date y Location para agregar una actividad' });
  }

  try {
    const connection = await pool.getConnection();
    await connection.query('INSERT INTO Activity (Event_Name, Activity_Date, Location) VALUES (?, ?, ?)', [Event_Name, Activity_Date, Location]);
    connection.release();
    res.status(201).json({ message: 'Actividad agregada correctamente' });
  } catch (error) {
    console.error('Error al agregar la actividad:', error);
    res.status(500).json({ error: 'Ocurrió un error al agregar la actividad' });
  }
};
export const updateActivity = async (req, res) => {
  const { id } = req.params;
  const { Event_Name, Activity_Date, Location } = req.body;

  if (!Event_Name || !Activity_Date || !Location) {
      return res.status(400).json({ message: 'Event_Name, Activity_Date y Location son campos obligatorios' });
  }

  try {
      const updateSql = 'UPDATE Activity SET Event_Name = ?, Activity_Date = ?, Location = ? WHERE id = ?';
      await pool.query(updateSql, [Event_Name, Activity_Date, Location, id]);

      return res.status(200).json({ message: 'Actividad actualizada correctamente' });
  } catch (error) {
      console.error('Error al actualizar la actividad:', error);
      return res.status(500).json({ message: 'Ocurrió un error. Por favor, inténtalo de nuevo más tarde.' });
  }
};


export const deleteActivity = async (req, res) => {
  const { id } = req.params;

  if (!id) {
      return res.status(400).json({ error: 'Se requiere el ID de la actividad para eliminarla' });
  }

  try {
      const connection = await pool.getConnection();
      await connection.query('DELETE FROM Activity WHERE id = ?', [id]);
      connection.release();
      return res.status(200).json({ message: 'Actividad eliminada correctamente' });
  } catch (error) {
      console.error('Error al eliminar la actividad:', error);
      return res.status(500).json({ error: 'Ocurrió un error al eliminar la actividad' });
  }
};

//Schedule

export const getAllSchedules = async (req, res) => {
    try {
      const selectSql = 'SELECT * FROM Schedule';
      const [rows] = await pool.query(selectSql);
  
      console.log('Schedules retrieved successfully');
      return res.status(200).json(rows);
    } catch (error) {
      console.error('Error retrieving schedules:', error);
      return res.status(500).json({ message: 'An error occurred while retrieving schedules' });
    }
  };
  
  import { format } from 'date-fns'; // Importa la función format de la biblioteca date-fns

  export const updateSchedules = async (req, res) => {
      const { id } = req.params;
      const { day, start_time, end_time } = req.body;
  
      if (!day || !start_time || !end_time) {
          return res.status(400).json({ message: 'Day, start_time y end_time son campos obligatorios' });
      }
  
      try {
          // Consultar el schedule actual en la base de datos
          const currentSchedule = await pool.query('SELECT * FROM Schedule WHERE id = ?', [id]);
          if (currentSchedule.length === 0) {
              return res.status(404).json({ message: 'No se encontró el schedule' });
          }
  
          // Formatear las horas en un formato que MySQL pueda entender
          const formattedStartTime = format(new Date(`01/01/2000 ${start_time}`), 'HH:mm:ss');
          const formattedEndTime = format(new Date(`01/01/2000 ${end_time}`), 'HH:mm:ss');
  
          // Actualizar el schedule en la base de datos con las horas formateadas
          const updateSql = 'UPDATE Schedule SET day = ?, start_time = ?, end_time = ? WHERE id = ?';
          await pool.query(updateSql, [day, formattedStartTime, formattedEndTime, id]);
  
          return res.status(200).json({ message: 'Schedule actualizado correctamente' });
      } catch (error) {
          console.error('Error al actualizar el Schedule:', error);
          return res.status(500).json({ message: 'Ocurrió un error. Por favor, inténtalo de nuevo más tarde.' });
      }
  };

//personal

export const getAllPersonal = async (req, res) => {
    try {
        const selectSql = 'SELECT * FROM Personal';
        const [rows] = await pool.query(selectSql);
  
        console.log('Personal retrieved successfully');
        return res.status(200).json(rows);
    } catch (error) {
        console.error('Error retrieving personal:', error);
        return res.status(500).json({ message: 'An error occurred while retrieving personal' });
    }
};

export const updatePersonalInfo = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, start_time, end_time, DaysOfWeek, Working} = req.body;
  
  try {
    // Convertir el valor de tiempo de formato 12 horas a 24 horas
    const formattedStartTime = convertTo24HourFormat(start_time);
    const formattedEndTime = convertTo24HourFormat(end_time);

    // Update personal information in the database
    const updateSql = 'UPDATE Personal SET nombre = ?, email = ?, start_time = ?, end_time = ?, DayOfWeek = ?, Working= ? WHERE id = ?';
    
    // Transforma los días seleccionados en una cadena separada por comas
    const joinedDays = DaysOfWeek.join(', ');

    await pool.query(updateSql, [nombre, email, formattedStartTime, formattedEndTime, joinedDays, Working, id]);
  
    return res.status(200).json({ message: 'Personal information updated successfully' });
  } catch (error) {
    console.error('Error updating personal information:', error);
    return res.status(500).json({ message: 'An error occurred while updating the personal information.' });
  }
};

// Función para convertir el formato de tiempo de 12 horas a 24 horas
const convertTo24HourFormat = (time12h) => {
  const [time, period] = time12h.split(' ');
  const [hours, minutes] = time.split(':');
  let formattedHours = hours;
  if (period === 'PM') {
    formattedHours = (parseInt(hours) + 12).toString();
  }
  return `${formattedHours}:${minutes}`;
};





  
export const addPersonalInfo = async (req, res) => {
  const { nombre, start_time, end_time, email, DayOfWeek, Working } = req.body;

  // Verificar si los campos obligatorios están presentes
  if (!nombre || !start_time || !end_time || !DayOfWeek || Working === undefined) {
    return res.status(400).json({ error: 'Nombre, start_time, end_time, DayOfWeek y Working son campos obligatorios para agregar información del personal' });
  }

  try {
    // Convertir cadenas de tiempo a objetos Date
    const startTime = new Date(start_time);
    const endTime = new Date(end_time);

    // Insertar en la base de datos
    await pool.query('INSERT INTO Personal (nombre, start_time, end_time, email, DayOfWeek, Working) VALUES (?, ?, ?, ?, ?, ?)', [nombre, startTime, endTime, email || null, DayOfWeek, Working]);
    res.status(201).json({ message: 'Información del personal agregada correctamente' });
  } catch (error) {
    console.error('Error al agregar la información del personal:', error);
    res.status(500).json({ error: 'Ocurrió un error al agregar la información del personal' });
  }
};



  //Registro de cliente de llegada
  export const getTimestampsById = async (req, res) => {
    try {
      const { id } = req.params; // Obtener el ID desde los parámetros de la solicitud
      const selectSql = `SELECT timestamp FROM RegistroCliente WHERE id = ?`;
      const [rows] = await pool.query(selectSql, [id]);
  
      if (rows.length === 0) {
        return res.status(404).json({ message: 'No se encontraron registros con el ID proporcionado' });
      }
  
      console.log('Registros de timestamps obtenidos correctamente');
      return res.status(200).json(rows);
    } catch (error) {
      console.error('Error al obtener los registros de timestamps:', error);
      return res.status(500).json({ message: 'Ocurrió un error al obtener los registros de timestamps' });
    }
  };
  
  export const getIDByEmail = async (req, res) => {
    const { email } = req.params;
  
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
  
    try {
      const connection = await pool.getConnection();
      // Buscar el ID en la tabla EFC_client
      const [userRows] = await connection.execute('SELECT id FROM EFC_client WHERE email = ?', [email]);
      
      if (userRows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const userID = userRows[0].id;
  
      // Utilizar el ID para buscar en la tabla RegistroCliente
      const [timestampRows] = await connection.execute('SELECT timestamp FROM RegistroCliente WHERE id = ?', [userID]);
      connection.release();
  
      if (timestampRows.length === 0) {
        return res.status(404).json({ error: 'Timestamps not found for this user ID' });
      }
  
      // Extraer solo los timestamps y enviarlos como respuesta
      const timestamps = timestampRows.map(row => row.timestamp);
      res.status(200).json({ timestamps });
    } catch (error) {
      console.error('Error fetching user ID:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  
//Exercise Controllers

export const getChestExercises = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT ID, Name, Region, Positioning, Execution FROM Exercise WHERE Region = ?', ['Chest']);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
};

export const getBackExercises = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT ID, Name, Region, Positioning, Execution FROM Exercise WHERE Region = ?', ['Back']);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
};

export const getShoulderExercises = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT ID, Name, Region, Positioning, Execution FROM Exercise WHERE Region = ?', ['Shoulder']);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
};

  export const getBicepExercises = async (req, res) => {
      try {
      const [rows] = await pool.query('SELECT ID, Name, Region, Positioning, Execution FROM Exercise WHERE Region = ?', ['Bicep']);
      res.json(rows);
      } catch (error) {
      res.status(500).json({ message: "Something went wrong. Please try again later." });
      }
  };

  export const getTricepExercises = async (req, res) => {
      try {
      const [rows] = await pool.query('SELECT ID, Name, Region, Positioning, Execution FROM Exercise WHERE Region = ?', ['Tricep']);
      res.json(rows);
      } catch (error) {
      res.status(500).json({ message: "Something went wrong. Please try again later." });
      }
  };

  export const getLegExercises = async (req, res) => {
      try {
      const [rows] = await pool.query('SELECT ID, Name, Region, Positioning, Execution FROM Exercise WHERE Region = ?', ['Leg']);
      res.json(rows);
      } catch (error) {
      res.status(500).json({ message: "Something went wrong. Please try again later." });
      }
  };


  //Admin Exercise Controllers

  export const getAllExercises = async (req, res) => {
    try {
        const selectSql = 'SELECT Region, ID, Name, Positioning, Execution FROM Exercise'; // Actualiza la consulta para seleccionar los datos de la tabla "Exercise"
        const [rows] = await pool.query(selectSql);
  
        console.log('Exercises retrieved successfully'); // Actualiza el mensaje de registro
        return res.status(200).json(rows);
    } catch (error) {
        console.error('Error retrieving exercises:', error); // Actualiza el mensaje de error
        return res.status(500).json({ message: 'An error occurred while retrieving exercises' }); // Actualiza el mensaje de error
    }
};


export const updateExercise = async (req, res) => {
  const { ID } = req.params;
  const { Region, Name, Positioning, Execution } = req.body;

  try {
    // Query the current exercise information from the database
    const currentExerciseInfo = await pool.query('SELECT * FROM Exercise WHERE id = ?', [ID]);
    if (currentExerciseInfo.length === 0) {
      return res.status(404).json({ message: 'Exercise information not found' });
    }

    // Get the current values of exercise information
    const { Region: currentRegion, Name: currentName, Positioning: currentPositioning, Execution: currentExecution } = currentExerciseInfo[0];

    // Check if at least one field is different from the current value
    if (Region !== currentRegion || Name !== currentName || Positioning !== currentPositioning || Execution !== currentExecution) {
      // Update exercise information in the database
      const updateSql = 'UPDATE Exercise SET region = ?, name = ?, positioning = ?, execution = ? WHERE id = ?';
      await pool.query(updateSql, [Region || currentRegion, Name || currentName, Positioning || currentPositioning, Execution || currentExecution, ID]);

      return res.status(200).json({ message: 'Exercise information updated successfully' });
    } else {
      return res.status(400).json({ message: 'No changes were made to exercise information' });
    }
  } catch (error) {
    console.error('Error updating exercise information:', error);
    return res.status(500).json({ message: 'Please make a change to update the exercise information.' });
  }
};


export const addExercise = async (req, res) => {
  const { Region, Name, Positioning, Execution } = req.body;
  if (!Region || !Name || !Positioning || !Execution) {
    return res.status(400).json({ error: 'Region, Name, Positioning, and Execution are required to add an exercise' });
  }

  try {
    const connection = await pool.getConnection();
    await connection.query('INSERT INTO Exercise (Region, Name, Positioning, Execution) VALUES (?, ?, ?, ?)', [Region, Name, Positioning, Execution]);
    connection.release();
    res.status(201).json({ message: 'Exercise added successfully' });
  } catch (error) {
    console.error('Error adding exercise:', error);
    res.status(500).json({ error: 'An error occurred while adding the exercise' });
  }
};
  
  
  
//client//


export const LoginUser = async (req, res) => {
  const { email, password } = req.body;

  // Realizar una consulta SQL para buscar el email y validar el password
  const query = `SELECT email, password, otp_code, first_name, last_name, category, phone FROM EFC_client WHERE email = ?`;
  
  try {
      // Ejecutar la consulta utilizando el email proporcionado
      const [result] = await pool.query(query, [email]);
    
      if (result.length > 0) {
          // Si se encuentra una fila con el email proporcionado
          const { password: hashedPassword, otp_code, first_name, last_name, category, phone } = result[0];
          // Validar la contraseña proporcionada con la contraseña almacenada en la base de datos
          const isPasswordValid = await bcrypt.compare(password, hashedPassword);

          if (!isPasswordValid) {
              // Si la contraseña no coincide, devolver un mensaje de error
              return res.status(400).json({ message: 'Invalid email or password' });
          }

          // Si la contraseña coincide, genera un token de autenticación
          const token = jwt.sign({ email }, 'your_secret_key', { expiresIn: '1h' });

          // Devuelve el token junto con los datos del usuario
          res.status(200).json({ token, email, otp_code, first_name, last_name, category, phone });
      } else {
          // Si no se encuentra ninguna fila con el email proporcionado, devolver un mensaje de error
          res.status(404).json({ message: "User not found" });
      }
  } catch (error) {
      // Manejar cualquier error que pueda ocurrir durante la ejecución de la consulta
      console.error("Error retrieving user data:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};


export const getClients = async (req, res) => {
    try {
        // Realiza una consulta a la base de datos para obtener todos los clientes
        const [rows] = await pool.query('SELECT * FROM EFC_client');

        // Envía la lista de clientes como respuesta en formato JSON
        res.json(rows);
    } catch (error) {
        // Maneja cualquier error que ocurra durante la consulta
        console.error('Error fetching clients:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};
//REPORTES
export const getClientsReport = async (req, res) => {
  try {
    // Realiza una consulta para obtener el registro más antiguo de cada día para cada cliente
    const query = `
      SELECT rc.id AS RegistroCliente_id, 
             ec.first_name, 
             ec.last_name, 
             ec.email, 
             ec.category, 
             ec.phone,
             MIN(rc.timestamp) AS RegistroCliente_timestamp
      FROM RegistroCliente rc
      INNER JOIN EFC_client ec ON rc.id = ec.id
      GROUP BY rc.id, DATE(rc.timestamp);
    `;
    
    const [rows] = await pool.query(query);

    // Envía los resultados en formato JSON
    res.json(rows);
  } catch (error) {
    // Maneja cualquier error que ocurra durante la consulta
    console.error('Error fetching clients report:', error);
    res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
};




export const getClientById = async (req, res) => {
  try {
    const { id } = req.params;

    // Consulta para obtener los datos del cliente
    const [clientRows] = await pool.query('SELECT id, first_name, last_name, category, phone FROM EFC_client WHERE id = ?', [id]);

    // Verifica si se encontró el cliente
    if (clientRows.length === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Consulta para obtener las marcas de tiempo más antiguas para cada día del cliente
    const query = `
      SELECT MIN(timestamp) AS first_timestamp
      FROM RegistroCliente
      WHERE id = ?
      GROUP BY DATE(timestamp)
    `;
    const [registrationRows] = await pool.query(query, [id]);

    // Formatea los registros de timestamp en formato ISO 8601
    const timestamps = registrationRows.map(row => row.first_timestamp.toISOString());

    // Construye el objeto de datos del cliente
    const clientData = {
      id: clientRows[0].id,
      first_name: clientRows[0].first_name,
      last_name: clientRows[0].last_name,
      category: clientRows[0].category,
      phone: clientRows[0].phone,
      timestamps: timestamps // Agrega los timestamps al objeto de datos del cliente
    };

    // Devuelve los datos del cliente junto con los timestamps asociados
    res.json(clientData);
  } catch (error) {
    console.error('Error fetching client by ID:', error);
    res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
};








  ////////////////////////////////////////////////////////////////////////
export const Client_Change = async (req, res) => { 
    const { email } = req.body;
    const sql = 'SELECT email FROM `EFC_client` WHERE email = ?';
    
    try {
        const [rows] = await pool.query(sql, [email]);
        if (rows.length > 0) {
            const confirmationCode = generateOTP();
            const hashedOTP = await bcrypt.hash(confirmationCode, 10);

            // Actualiza el registro existente con el nuevo OTP hasheado
            const updateSql = 'UPDATE `EFC_client` SET otp_code = ? WHERE email = ?';
            await pool.query(updateSql, [hashedOTP, email]);
            console.log('OTP sent for email change');

            const subject = 'Password Change OTP';
            const message = `Your OTP code for password change is: ${confirmationCode}. Use this code to proceed with the password change.`;

            // Envía el correo electrónico con el nuevo código de verificación
            sendEmail(email, subject, message);

            return res.json({ message: 'OTP sent for password change' });
        } else {
            console.log('User does not exist');
            return res.status(400).json({ message: 'User does not exist' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};

export const ChangePassword = async (req, res) => {
    const { email, otp_code, password } = req.body;
    const sql = 'SELECT * FROM `EFC_client` WHERE email = ?';

    try {
        const [rows] = await pool.query(sql, [email]);

        // Verificar si el correo electrónico existe en la base de datos
        if (rows.length <= 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Obtener el código OTP almacenado en la base de datos para el usuario correspondiente
        const storedOTP = rows[0].otp_code;

        // Verificar el código OTP proporcionado con el almacenado en la base de datos
        const isOTPValid = await bcrypt.compare(otp_code, storedOTP);

        if (!isOTPValid) {
            return res.status(400).json({ message: 'OTP is invalid' });
        }

        // Generar el hash de la nueva contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Verificar si la nueva contraseña es diferente de la contraseña actual
        const currentPassword = rows[0].password;
        const isSamePassword = await bcrypt.compare(password, currentPassword);
        if (isSamePassword) {
            return res.status(400).json({ message: 'New password must be different from the current password' });
        }

        // Actualizar la contraseña del usuario
        const updateSql = 'UPDATE `EFC_client` SET password = ? WHERE email = ?';
        await pool.query(updateSql, [hashedPassword, email]);

        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};


export const deleteEFC_client = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM EFC_client WHERE id = ?', [req.params.id]);
        if (result.affectedRows <= 0) {
            return res.status(404).json({ message: 'EFC_client not found' });
        }
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({message: "Something went wrong. Please try again later."});
    }
}