//conexion con sql
require('dotenv').config();

const sql = require('mssql/msnodesqlv8');

const configuracion = {
    server: process.env.SQL_HOST,
    database: 'JeycobStockIdentidad',
    options: {
        trustedConnection: true,
        trustServerCertificate: true
    },
    driver: 'msnodesqlv8'
};

async function conectarSQLServer() {

    try {
        const conexion = await sql.connect(configuracion);

        console.log('Conexión con SQL Server exitosa');

        return conexion;

    } catch (error) {

        console.error('Error de SQL Server:', error.message);

        throw error;
    }
}

module.exports = conectarSQLServer;