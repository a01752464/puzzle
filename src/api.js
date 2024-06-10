const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const util = require('util');

const app = express();

app.use(cors());

app.use(express.json());

// Configuración del servidor
const port = 8080;
const ipAddr = process.env.IP_ELASTICA; // Actualiza con tu dirección IP o nombre de host

// Crear una conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    database: 'scape_room',
    user: process.env.MYSQL_USER, 
    password: process.env.MYSQL_PASSWORD
});

// Promisificar métodos para permitir su uso con async/await
db.connect = util.promisify(db.connect);
db.query = util.promisify(db.query);

app.use((req, res, next) => {
    console.log(new Date(), req.method, req.url);
    next();
});

// Definir un manejador para la URL raíz para devolver 404
app.get('/', (req, res) => {
    res.status(404).send('404 - No Encontrado'); 
});

// ========= GET ==========
app.get('/tabla', async (req,res) => {
    try {
        const result = await db.query('SELECT * FROM clientes');
        res.json(result);
    }catch (err) {
        console.error(err);
        res.status(500).json({message: "Internal server error"});
    }
});

// Nuevo endpoint para obtener el podio y la posición del usuario
app.get('/podio/:id', async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'ID es requerido' });
    }

    try {
        // Obtener los tres primeros lugares, ignorando los tiempos nulos
        const top3Query = 'SELECT nombre_completo, tiempo FROM clientes WHERE tiempo IS NOT NULL ORDER BY tiempo ASC LIMIT 3';
        const top3 = await db.query(top3Query);

        // Obtener la posición del usuario, ignorando los tiempos nulos
        const userQuery = `
            SELECT nombre_completo, tiempo, (
                SELECT COUNT(*) + 1 FROM clientes WHERE tiempo < t1.tiempo AND tiempo IS NOT NULL
            ) AS posicion
            FROM clientes t1 WHERE id = ? AND tiempo IS NOT NULL
        `;
        const user = await db.query(userQuery, [id]);

        if (user.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado o sin tiempo registrado' });
        }

        res.status(200).json({
            top3: top3,
            user: user[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor al obtener el podio' });
    }
});

// ========= METODOS POST ========

app.post('/registro', async (req, res) => {
    const { nombre_completo, edad, telefono } = req.body;
    if (!nombre_completo || !edad || telefono === undefined) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const sql = `INSERT INTO clientes (nombre_completo, edad, telefono)
                 VALUES (?, ?, ?)`; // Inicialmente, estatus es 0

    try {
        const result = await db.query(sql, [nombre_completo, edad, telefono]);
        res.status(201).json({ message: `Registro creado con ID: ${result.insertId}`, success: true, insertId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor al insertar el registro' });
    }
});

app.post('/update-time', async (req, res) => {
    const { id, tiempo } = req.body;
    if (!id || tiempo === undefined) {
        return res.status(400).json({ error: 'ID y tiempo son requeridos' });
    }

    const sql = `UPDATE clientes SET tiempo = ? WHERE id = ?`;

    try {
        await db.query(sql, [tiempo, id]);
        res.status(200).json({ message: 'Tiempo actualizado correctamente', success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor al actualizar el tiempo' });
    }
});
    

// Alternativa para otras rutas no definidas
app.use((req, res) => {
    res.type('text').status(404).send('404 - No Encontrado');
});

// Iniciar el servidor
app.listen(port, () => console.log(`Express iniciado en http://${ipAddr}:${port}\nPresione Ctrl-C para terminar.`));

// Conectar a la base de datos
(async () => {
    try {
        await db.connect();
        console.log('Conectado a la base de datos.');
    } catch (err) {
        console.error('No se pudo conectar a la base de datos.');
        throw err;
    }
})();
