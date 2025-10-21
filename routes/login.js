const express = require('express');
const router = express.Router();
const { query } = require('../db'); // tu función query con pg Pool y promesas
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = 'mi_clave_secreta'; // cambia en producción

// Cerrar sesión
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// Mostrar formulario de login
router.get('/', (req, res) => {
  res.render('login', { error: '' });
});

// Procesar login (POST /login)
router.post('/', async (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    if (req.headers.accept?.includes('application/json')) {
      return res.status(400).json({ error: 'Faltan datos' });
    }
    return res.render('login', { error: 'Faltan datos' });
  }

  try {
    const result = await query('SELECT * FROM usuarios WHERE usuario = $1', [usuario]);
    const results = result.rows;

    if (results.length === 0) {
      if (req.headers.accept?.includes('application/json')) {
        return res.status(401).json({ error: 'Credenciales incorrectas' });
      }
      return res.render('login', { error: 'Credenciales incorrectas' });
    }

    const user = results[0];

    // Verificar contraseña (hash o texto plano si es antiguo)
    let match = false;
    if (user.password.startsWith('$2')) {
      match = await bcrypt.compare(password, user.password);
    } else {
      match = password === user.password;
    }

    if (!match) {
      if (req.headers.accept?.includes('application/json')) {
        return res.status(401).json({ error: 'Credenciales incorrectas' });
      }
      return res.render('login', { error: 'Credenciales incorrectas' });
    }

    // Login exitoso
    req.session.user = { id: user.id, usuario: user.usuario };

    if (req.headers.accept?.includes('application/json')) {
      const token = jwt.sign({ id: user.id, usuario: user.usuario }, SECRET_KEY, { expiresIn: '1h' });
      return res.json({ message: 'Login exitoso', token });
    } else {
      return res.redirect('/home');
    }

  } catch (err) {
    console.error(err);
    if (req.headers.accept?.includes('application/json')) {
      return res.status(500).json({ error: 'Error en la base de datos' });
    }
    return res.render('login', { error: 'Error en la base de datos' });
  }
});

module.exports = router;
