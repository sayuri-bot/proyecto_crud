const express = require('express');
const router = express.Router();
const multer = require('multer');
const { pool } = require('../db'); // ✅ tu conexión con PostgreSQL
const path = require('path');
const fs = require('fs');

// 📂 Configuración de almacenamiento para multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// 📸 Página principal: mostrar categorías, productos e imágenes filtradas
router.get('/', async (req, res) => {
  try {
    const { categoria_id, producto_id } = req.query;

    const categorias = await pool.query('SELECT * FROM categorias');
    const productos = await pool.query('SELECT * FROM productos');

    let query = 'SELECT * FROM imagenes_productos';
    let params = [];

    if (producto_id) {
      query += ' WHERE producto_id = $1';
      params.push(producto_id);
    } else if (categoria_id) {
      query +=
        ' WHERE producto_id IN (SELECT id FROM productos WHERE categoria_id = $1)';
      params.push(categoria_id);
    }

    const imagenes = await pool.query(query, params);

    res.render('imagenes', {
      categorias: categorias.rows,
      productos: productos.rows,
      categoria_id,
      producto_id,
      imagenes: imagenes.rows
    });
  } catch (err) {
    console.error('❌ Error al obtener imágenes:', err);
    res.render('error', { mensaje: 'Error al obtener imágenes' });
  }
});

// 📁 Formulario para subir imágenes
router.get('/producto/nueva', async (req, res) => {
  try {
    const categorias = await pool.query('SELECT * FROM categorias');
    const productos = await pool.query('SELECT * FROM productos');
    res.render('imagen_form', {
      categorias: categorias.rows,
      productos: productos.rows
    });
  } catch (err) {
    res.render('error', { mensaje: 'Error al cargar formulario' });
  }
});

// 📤 Subir imágenes a producto
router.post('/producto/:producto_id', upload.array('imagenes', 10), async (req, res) => {
  const { producto_id } = req.params;
  const files = req.files;

  if (!files || files.length === 0) {
    return res.render('error', { mensaje: 'Por favor, selecciona al menos una imagen' });
  }

  try {
    const values = files.map((f) => `('${'/uploads/' + f.filename}', ${producto_id})`).join(',');

    await pool.query(`INSERT INTO imagenes_productos (url, producto_id) VALUES ${values}`);
    res.redirect(`/imagenes?producto_id=${producto_id}`);
  } catch (err) {
    console.error('❌ Error al guardar imágenes:', err);
    res.render('error', { mensaje: 'Error al guardar las imágenes' });
  }
});

// 🗑️ Eliminar imagen
router.post('/eliminar/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const imagen = await pool.query('SELECT * FROM imagenes_productos WHERE id = $1', [id]);
    if (imagen.rows.length === 0) {
      return res.render('error', { mensaje: 'Imagen no encontrada' });
    }

    const imagePath = path.join('public', imagen.rows[0].url);
    await pool.query('DELETE FROM imagenes_productos WHERE id = $1', [id]);

    // Eliminar archivo físico si existe
    fs.unlink(imagePath, (err) => {
      if (err) console.warn('⚠️ No se pudo borrar archivo (posiblemente no existe):', err.message);
      res.redirect('/imagenes' + (imagen.rows[0].producto_id ? `?producto_id=${imagen.rows[0].producto_id}` : ''));
    });
  } catch (err) {
    console.error('❌ Error al eliminar imagen:', err);
    res.render('error', { mensaje: 'Error al eliminar la imagen' });
  }
});

module.exports = router;
