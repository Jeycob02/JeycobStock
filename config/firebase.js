//coneccion con firebase
const { initializeApp, applicationDefault, getApps } = require('firebase-admin/app');

const { getFirestore } = require('firebase-admin/firestore');

const app = getApps().length
    ? getApps()[0]
    : initializeApp({
        credential: applicationDefault(),
        projectId: 'aqueous-cabinet-416723'
    });

const db = getFirestore(app);

module.exports = db;