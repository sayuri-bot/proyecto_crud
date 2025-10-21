require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const isAuthenticated = require('./middleware/auth');
const { query } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());

// Sesiones (advertencia: MemoryStore no es recomendado en producción)
app.use(session({
  secret: 'mi_clave_secreta',
  resave: false,
  saveUninitialized: false,
  // store: usar un store persistente en producción como Redis o connect-pg-simple
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
