const express = require('express');
const router = express.Router();
const { query } = require('../db'); // usamos la función query con async/await

// 📄 Listar todas las categorías
router.get('/', async (req, res) => {
  try {
    const results = await query('SELECT * FROM categorias ORDER BY id ASC');
    res.render('categorias', { categorias: results.rows });
  } catch (err) {
    console.error('❌ Error al obtener categorías:', err.message);
    res.render('error', { mensaje: 'Error al obtener categorías' });
  }
});

// 📝 Mostrar formulario para nueva categoría
router.get('/nueva', (req, res) => {
  res.render('categoria_form', { categoria: {}, accion: 'Crear', error: null });
});

// ➕ Crear nueva categoría
router.post('/nueva', async (req, res) => {
  const { nombre } = req.body;
  if (!nombre)
    return res.render('categoria_form', {
      categoria: {},
      accion: 'Crear',
      error: 'El nombre es obligatorio',
    });

  try {
    await query('INSERT INTO categorias (nombre) VALUES ($1)', [nombre]);
    res.redirect('/categorias');
  } catch (err) {
    console.error('❌ Error al crear categoría:', err.message);
    res.render('categoria_form', {
      categoria: {},
      accion: 'Crear',
      error: 'Error al crear categoría',
    });
  }
});

// ✏️ Mostrar formulario para editar categoría
router.get('/editar/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const results = await query('SELECT * FROM categorias WHERE id = $1', [id]);
    if (results.rows.length === 0)
      return res.render('error', { mensaje: 'Categoría no encontrada' });

    res.render('categoria_form', {
      categoria: results.rows[0],
      accion: 'Editar',
      error: null,
    });
  } catch (err) {
    console.error('❌ Error al obtener categoría:', err.message);
    res.render('error', { mensaje: 'Error al obtener categoría' });
  }
});

// 🧩 Editar categoría
router.post('/editar/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  if (!nombre)
    return res.render('categoria_form', {
      categoria: { id, nombre },
      accion: 'Editar',
      error: 'El nombre es obligatorio',
    });

  try {
    await query('UPDATE categorias SET nombre = $1 WHERE id = $2', [nombre, id]);
    res.redirect('/categorias');
  } catch (err) {
    console.error('❌ Error al actualizar categoría:', err.message);
    res.render('categoria_form', {
      categoria: { id, nombre },
      accion: 'Editar',
      error: 'Error al actualizar categoría',
    });
  }
});

// 🗑️ Eliminar categoría
router.post('/eliminar/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM categorias WHERE id = $1', [id]);
    res.redirect('/categorias');
  } catch (err) {
    console.error('❌ Error al eliminar categoría:', err.message);
    res.render('error', { mensaje: 'Error al eliminar categoría' });
  }
});

// 📦 Mostrar productos de una categoría
router.get('/:id/productos', async (req, res) => {
  const { id } = req.params;
  try {
    const catResults = await query('SELECT * FROM categorias WHERE id = $1', [id]);
    if (catResults.rows.length === 0)
      return res.render('error', { mensaje: 'Categoría no encontrada' });

    const categoria = catResults.rows[0];
    const prodResults = await query('SELECT * FROM productos WHERE categoria_id = $1', [id]);

    res.render('productos_categoria', {
      categoria,
      productos: prodResults.rows,
      session: req.session,
    });
  } catch (err) {
    console.error('❌ Error al obtener productos:', err.message);
    res.render('error', { mensaje: 'Error al obtener productos de la categoría' });
  }
});

module.exports = router;
