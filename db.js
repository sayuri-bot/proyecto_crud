const { Pool } = require('pg');

const pool = new Pool({
  host: 'dpg-d3rtad1r0fns73e2p60g-a.oregon-postgres.render.com', // Host de Render
  user: 'tienda_fyc5_user',   // Usuario de la base
  password: 'NbwYwWeBVe0pEHxZYx3aIfiGdZ5FLDPR', // Contraseña
  database: 'tienda_fyc5',    // Nombre de la base
  port: 5432,
  ssl: {
    rejectUnauthorized: false // Esto es común para Render que usa SSL pero sin certificado verificado
  },
  max: 10,        // Límite máximo de conexiones en el pool
  idleTimeoutMillis: 30000,  // Tiempo antes de cerrar conexiones inactivas
  connectionTimeoutMillis: 2000, // Tiempo para intentar conexión
});

module.exports = pool;
