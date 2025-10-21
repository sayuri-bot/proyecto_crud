require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const isAuthenticated = require('./middleware/auth');
const { query } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para permitir solo IP 45.232.149.130
function checkAllowedIP(req, res, next) {
  const allowedIP = '45.232.149.130';
  const clientIP = req.ip.replace('::ffff:', '');

  if (clientIP === allowedIP) {
    next();
  } else {
    res.status(403).send('Acceso denegado: IP no autorizada');
  }
}

// Aplicar filtro de IP antes que cualquier ruta
app.use(checkAllowedIP);

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(cors()); // Puedes personalizar o dejar así
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());

// Sesiones (advertencia: MemoryStore no es recomendado en producción)
app.use(session({
  secret: 'mi_clave_secreta',
  resave: false,
  saveUninitialized: false,
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Sesión disponible en vistas
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Rutas
const categoriasRoutes = require('./routes/categorias');
const productosRoutes = require('./routes/productos');
const imagenesRoutes = require('./routes/imagenes');
const loginRoutes = require('./routes/login');
const registrarRoutes = require('./routes/registrar');
const homeRoutes = require('./routes/home');

app.use('/login', loginRoutes);
app.use('/registrar', registrarRoutes);
app.use('/home', homeRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/productos', productosRoutes);
app.use('/imagenes', imagenesRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.redirect('/productos');
});

// Error 404
app.use((req, res) => {
  res.status(404).render('error', { mensaje: 'Página no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
