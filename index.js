const express = require('express');
const cors = require('cors');
const app = express();
const port = 3002;
const mysql = require('mysql2');


// Configurar conexion a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'Empleados',
});


// Conectar a la base de datos
connection.connect((error) => {
  if (error) {
    console.error('Error de conexión a la base de datos:', error);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});

app.use(cors());
app.use(express.json());

// recibir datos del frontend y insertarlos en la base de datos
app.post('/insertarEmpleado', (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: 'Cuerpo de solicitud vacío' });
  }

  const { nombre, apellidos, dni, email, fechaAlta } = req.body;

  const fechaFormateada = new Date(fechaAlta).toISOString().slice(0, 19).replace('T', ' ');

  // insercion en la base de datos
  const sql = 'INSERT INTO empleados (nombre, apellidos, dni, email, fechaAlta) VALUES (?, ?, ?, ?, ?)';
  connection.query(sql, [nombre, apellidos, dni, email, fechaFormateada], (error, results) => {
    if (error) {
      console.error('Error al insertar datos en la base de datos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      console.log('Datos insertados correctamente:', results);
      res.json({ success: true, message: 'Datos insertados correctamente' });
    }
  });
});

// Listar todos los empleados
app.get('/obtenerEmpleados', (req, res) => {
  const sql = 'SELECT * FROM empleados';

  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Error al obtener datos de la base de datos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      console.log('Datos obtenidos correctamente:', results);
      res.json({ success: true, empleados: results });
    }
  });
});

app.listen(port, () => {
  console.log(`La aplicación está escuchando en http://localhost:${port}`);
});
