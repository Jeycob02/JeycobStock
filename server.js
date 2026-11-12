
const express = require('express');
const pool = require('./config/database');
//traemos lo de firebase 
const db =require ('./config/firebase');
//mongo
const conectarMongoDB = require('./config/mongodb');
//sql server
const conectarSQLServer = require('./config/sqlserver');

const app = express();

const PORT = 3000;

// Información JSON
app.use(express.json());

// Publica los archivos del frontend
app.use(express.static('public'));

// Compr conexion PostgreSQL
app.get('/api/dbtest', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT NOW()');

        res.json({
            mensaje: 'Conexion con PostgreSQL exitosa',
            fecha: resultado.rows[0].now
        });

    } catch (error) {
        console.error('Error de PostgreSQL:', error.message);

        res.status(500).json({
            mensaje: 'Error al conectar con PostgreSQL'
        });
    }
});
// consulkta productos 
app.get('/api/productos', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM producto');

        res.json(resultado.rows);

    } catch (error) {
        console.error('Error al consultar productos:', error.message);

        res.status(500).json({
            mensaje: 'Error al consultar productos'
        });
    }
});

// regsitor productos 
app.post('/api/productos', async (req, res) => {


// eliminar productos 



    try {
        const { nombre, codigo_producto, precio_venta } = req.body;

        if (!nombre || !codigo_producto || precio_venta === undefined) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }
//no duplicar codigos
        const precio = Number(precio_venta);

        if (!Number.isFinite(precio) || precio < 0) {
            return res.status(400).json({
                mensaje: 'El precio de venta no es válido'
            });
        }

       const codigoExistente = await pool.query(
          'SELECT id FROM producto WHERE codigo_producto = $1',
          [codigo_producto.trim()]
);

       if (codigoExistente.rows.length > 0) {
             return res.status(409).json({
                 mensaje: 'Ya existe un producto con ese código'
    });
}
        //reg produc 

        const resultado = await pool.query(
            `INSERT INTO producto (nombre, codigo_producto, precio_venta)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [nombre.trim(), codigo_producto.trim(), precio]
        );

        res.status(201).json({
            mensaje: 'Producto registrado correctamente',
            producto: resultado.rows[0]
        });

    } catch (error) {
        console.error('Error al registrar producto:', error.message);

        res.status(500).json({
            mensaje: 'No fue posible registrar el producto'
        });
    }
});

app.delete('/api/productos/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'El ID del producto no es válido'
            });
        }

        // mirar existencia 
        const producto = await pool.query(
            'SELECT * FROM producto WHERE id = $1',
            [id]
        );

        if (producto.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });
        }

        // mirar relaciones con otros productos 
        const relacionado = await pool.query(
            `SELECT EXISTS (
                SELECT 1 FROM inventario WHERE id_producto = $1
            ) OR EXISTS (
                SELECT 1 FROM producto_distribuidor WHERE id_producto = $1
            ) AS tiene_relaciones`,
            [id]
        );

        if (relacionado.rows[0].tiene_relaciones) {
            return res.status(409).json({
                mensaje: 'No se puede eliminar: el producto tiene registros relacionados'
            });
        }

        // funcion eliminar
        //poner editar
        await pool.query(
            'DELETE FROM producto WHERE id = $1',
            [id]
        );

        res.json({
            mensaje: 'Producto eliminado correctamente'
        });

    } catch (error) {
        console.error('Error al eliminar producto:', error.message);

        res.status(500).json({
            mensaje: 'No fue posible eliminar el producto'
        });
    }
});

// datos fir
app.post('/api/firestoretest', async (req, res) => {
    try {
        await db.collection('notificaciones').add({
            titulo: 'Prueba desde Node.js',
            mensaje: 'JeycobStock conectado con Firebase',
            tipo: 'prueba',
            leida: false,
            fecha_creacion: new Date()
        });

        res.json({
            mensaje: 'Conexion con Firebase exitosa'
        });

    } catch (error) {
        console.error('Error de Firebase:', error.message);

        res.status(500).json({
            mensaje: 'Error al conectar con Firebase'
        });
    }
});
//mongo reg false
app.post('/api/mongotest', async (req, res) => {

    try {
        const db = await conectarMongoDB();

        const resultado = await db.collection('auditoria').insertOne({
            tipo_evento: 'prueba_desde_node',
            usuario: 'sistema',
            descripcion: 'JeycobStock conectado con MongoDB desde Node.js',
            fecha: new Date(),
            resultado: 'exitoso'
        });

        res.json({
            mensaje: 'Conexion con MongoDB exitosa',
            id: resultado.insertedId
        });

    } catch (error) {

        console.error('Error de MongoDB:', error.message);

        res.status(500).json({
            mensaje: 'Error al conectar con MongoDB'
        });
    }
});

// Prueba de conexion SQL Server
app.get('/api/sqlservertest', async (req, res) => {
    try {
        const conexion = await conectarSQLServer();

        const resultado = await conexion.request()
            .query('SELECT DB_NAME() AS base_datos');

        res.json({
            mensaje: 'Conexion con SQL Server exitosa',
            base_datos: resultado.recordset[0].base_datos
        });

    } catch (error) {
        console.error('Error SQL Server:', error.message);

        res.status(500).json({
            mensaje: 'Error al conectar con SQL Server'
        });
    }
});

app.listen(PORT, () => {
  
    console.log(`Servidor de JeycobStock ejecutándose en http://localhost:${PORT}`);
});
