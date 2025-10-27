const express = require('express');
const router = express.Router();
const { query } = require('../db'); // tu función con Pool y promesas
const bcrypt = require('bcryptjs');

// Mostrar formulario de registro
router.get('/', (req, res) => {
  res.render('registrar', { error: '' });
});

// Procesar registro (POST /registrar)
router.post('/', async (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.render('registrar', { error: 'Faltan datos' });
  }

  try {
    // Verificar si ya existe el usuario
    const existingUser = await query('SELECT * FROM usuarios WHERE usuario = $1', [usuario]);

    if (existingUser.rows.length > 0) {
      return res.render('registrar', { error: 'El usuario ya existe' });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar nuevo usuario
    await query('INSERT INTO usuarios (usuario, password) VALUES ($1, $2)', [usuario, hashedPassword]);

    res.redirect('/login');

  } catch (error) {
    console.error('❌ Error en registro:', error);
    res.render('registrar', { error: 'Error en la base de datos' });
  }
});

module.exports = router;
