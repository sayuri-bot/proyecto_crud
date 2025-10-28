const express = require('express');
const router = express.Router();
const { query } = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = process.env.JWT_SECRET || 'mi_clave_secreta';

// 🔹 Cerrar sesión
router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(() => res.redirect('/login'));
  } else {
    res.redirect('/login');
  }
});

// 🔹 Formulario de login
router.get('/', (req, res) => {
  res.render('login', { error: '' });
});

// 🔹 Procesar login
router.post('/', async (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.render('login', { error: 'Faltan datos' });
  }

  try {
    console.log('📥 Intentando loguear usuario:', usuario);

    const result = await query('SELECT * FROM usuarios WHERE usuario = $1', [usuario]);
    console.log('📊 Resultado SQL:', result);

    if (!result || !result.rows || result.rows.length === 0) {
      console.log('⚠️ Usuario no encontrado');
      return res.render('login', { error: 'Credenciales incorrectas' });
    }

    const user = result.rows[0];
    console.log('🧍 Usuario encontrado:', user.usuario);

    let match = false;
    if (user.password.startsWith('$2')) {
      match = await bcrypt.compare(password, user.password);
    } else {
      match = password === user.password;
    }

    if (!match) {
      console.log('❌ Contraseña incorrecta');
      return res.render('login', { error: 'Credenciales incorrectas' });
    }

    // Guardar sesión
    req.session.user = { id: user.id, usuario: user.usuario };

    // JWT si es API
    if (req.headers.accept?.includes('application/json')) {
      const token = jwt.sign({ id: user.id, usuario: user.usuario }, SECRET_KEY, { expiresIn: '1h' });
      return res.json({ message: 'Login exitoso', token });
    }

    console.log('✅ Login exitoso');
    return res.redirect('/home');

  } catch (err) {
    console.error('❌ Error en login:', err);
    return res.render('login', { error: 'Error en el servidor o base de datos' });
  }
});

module.exports = router;
