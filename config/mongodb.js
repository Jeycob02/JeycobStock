require('dotenv').config();

const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';

const cliente = new MongoClient(uri);

let db;

async function conectarMongoDB() {

    if (!db) {
        await cliente.connect();

        db = cliente.db('JeycobStockSeguridad');

        console.log('Conexión con MongoDB exitosa');
    }

    return db;
}

module.exports = conectarMongoDB;