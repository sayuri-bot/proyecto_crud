require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { query } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Render está detrás de un proxy → necesario para obtener IP real del cliente
app.set('trust proxy', true);

// 🔒 Middleware: solo permitir acceso desde tu IP pública
function checkAllowedIP(req, res, next) {
  const allowedIP = ''; // <-- tu IP pública fija
  const clientIP = req.ip?.replace('::ffff:', '') || 'desconocida'; // limpia IPv6

  console.log(`🌐 Intento de acceso desde IP: ${clientIP}`);

  // Si la IP coincide, continuar
  if (clientIP === allowedIP) {
    return next();
  }

  // Si la IP es distinta → bloquear acceso
  console.log(`🚫 Acceso bloqueado para IP no autorizada: ${clientIP}`);
  return res.status(403).send(`
    <h1>🚫 Acceso denegado</h1>
    <p>Tu IP (<b>${clientIP}</b>) no está autorizada para acceder a este servidor.</p>
  `);
}

// 🔹 Aplicar filtro global de IP antes de cualquier otra ruta
app.use(checkAllowedIP);

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares base
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());

// Sesiones
app.use(session({
  secret: 'mi_clave_secreta',
  resave: false,
  saveUninitialized: false,
}));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Hacer sesión accesible en vistas EJS
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Importar rutas
const categoriasRoutes = require('./routes/categorias');
const productosRoutes = require('./routes/productos');
const imagenesRoutes = require('./routes/imagenes');
const loginRoutes = require('./routes/login');
const registrarRoutes = require('./routes/registrar');
const homeRoutes = require('./routes/home');

// Usar rutas
app.use('/login', loginRoutes);
app.use('/registrar', registrarRoutes);
app.use('/home', homeRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/productos', productosRoutes);
app.use('/imagenes', imagenesRoutes);

// Ruta raíz
app.get('/', (req, res) => res.redirect('/home'));

// Error 404
app.use((req, res) => {
  res.status(404).render('error', { mensaje: 'Página no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
