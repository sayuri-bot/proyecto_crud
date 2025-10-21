const express = require('express');
const router = express.Router();
const { query } = require('../db'); // Importa la función query

// Middleware para proteger rutas (solo usuarios autenticados)
function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  res.status(403).render('error', { mensaje: 'Acceso denegado. Inicia sesión.' });
}

// Listar productos
router.get('/', async (req, res) => {
  try {
    const sql = `
      SELECT p.*, 
        (SELECT url FROM imagenes_productos WHERE producto_id = p.id LIMIT 1) as imagen_url 
      FROM productos p`;
    const results = await query(sql);
    res.render('productos', { productos: results.rows, session: req.session });
  } catch (err) {
    console.error('Error al obtener productos:', err.message);
    res.render('error', { mensaje: 'Error al obtener productos' });
  }
});

// Mostrar formulario para crear producto (protegido)
router.get('/nuevo', requireAuth, (req, res) => {
  const categoria_id = req.query.categoria_id || '';
  res.render('producto_form', { producto: { categoria_id }, accion: 'Crear', session: req.session });
});

// Crear producto (protegido)
router.post('/', requireAuth, async (req, res) => {
  try {
    let { nombre, precio, categoria_id } = req.body;
    if (!categoria_id || categoria_id === '') categoria_id = null;

    let sql, params;
    if (categoria_id) {
      sql = 'INSERT INTO productos (nombre, precio, categoria_id) VALUES ($1, $2, $3)';
      params = [nombre, precio, categoria_id];
    } else {
      sql = 'INSERT INTO productos (nombre, precio, categoria_id) VALUES ($1, $2, NULL)';
      params = [nombre, precio];
    }

    await query(sql, params);

    if (categoria_id) {
      res.redirect(`/categorias/${categoria_id}/productos`);
    } else {
      res.redirect('/productos');
    }
  } catch (err) {
    console.error('Error al crear producto:', err.message);
    res.render('error', { mensaje: 'Error al crear producto: ' + err.message });
  }
});

// Ver detalle de producto
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const productoResult = await query(
      `SELECT p.*, c.nombre as categoria_nombre 
       FROM productos p 
       LEFT JOIN categorias c ON p.categoria_id = c.id 
       WHERE p.id = $1`,
      [id]
    );

    if (productoResult.rows.length === 0) {
      return res.render('error', { mensaje: 'Producto no encontrado' });
    }

    const producto = productoResult.rows[0];

    const imagenesResult = await query(
      'SELECT * FROM imagenes_productos WHERE producto_id = $1',
      [id]
    );

    res.render('producto_detalle', {
      producto,
      categoria: producto.categoria_nombre ? { nombre: producto.categoria_nombre } : null,
      imagenes: imagenesResult.rows,
      session: req.session
    });
  } catch (err) {
    console.error('Error al obtener detalle de producto:', err.message);
    res.render('error', { mensaje: 'Error al obtener detalle de producto' });
  }
});

// Mostrar formulario para editar producto (protegido)
router.get('/editar/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const results = await query('SELECT * FROM productos WHERE id = $1', [id]);
    if (results.rows.length === 0) {
      return res.render('error', { mensaje: 'Producto no encontrado' });
    }
    res.render('producto_form', { producto: results.rows[0], accion: 'Editar', session: req.session });
  } catch (err) {
    console.error('Error al obtener producto para editar:', err.message);
    res.render('error', { mensaje: 'Producto no encontrado' });
  }
});

// Actualizar producto (protegido)
router.post('/editar/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio } = req.body;
    await query('UPDATE productos SET nombre = $1, precio = $2 WHERE id = $3', [nombre, precio, id]);
    res.redirect('/productos');
  } catch (err) {
    console.error('Error al actualizar producto:', err.message);
    res.render('error', { mensaje: 'Error al actualizar producto' });
  }
});

// Eliminar producto (protegido)
router.post('/eliminar/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM productos WHERE id = $1', [id]);
    res.redirect('/productos');
  } catch (err) {
    console.error('Error al eliminar producto:', err.message);
    res.render('error', { mensaje: 'Error al eliminar producto' });
  }
});

module.exports = router;
