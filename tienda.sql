-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-09-2025 a las 17:42:19
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tienda`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`) VALUES
(1, 'Refrigeradoras'),
(2, 'Cocinas'),
(3, 'Lavadoras'),
(4, 'Televisores'),
(5, 'Pequeños Electrodomésticos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagenes_productos`
--

CREATE TABLE `imagenes_productos` (
  `id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `imagenes_productos`
--

INSERT INTO `imagenes_productos` (`id`, `producto_id`, `url`) VALUES
(11, 1, 'uploads/refrigeradora_samsung.jpg'),
(12, 2, 'uploads/refrigeradora_lg.jpg'),
(13, 3, 'uploads/cocina_mabe.jpg'),
(14, 4, 'uploads/cocina_indurama.jpg'),
(15, 5, 'uploads/lavadora_lg.jpg'),
(16, 6, 'uploads/lavadora_samsung.jpg'),
(17, 7, 'uploads/tv_samsung.jpg'),
(18, 8, 'uploads/tv_lg.jpg'),
(19, 9, 'uploads/licuadora_oster.jpg'),
(20, 10, 'uploads/microondas_panasonic.jpg'),
(21, 1, 'uploads/refrigeradora_samsung_frente.jpg'),
(22, 1, 'uploads/refrigeradora_samsung_lateral.jpg'),
(23, 1, 'uploads/refrigeradora_samsung_interior.jpg'),
(24, 2, 'uploads/refrigeradora_lg_frente.jpg'),
(25, 2, 'uploads/refrigeradora_lg_lateral.jpg'),
(26, 2, 'uploads/refrigeradora_lg_interior.jpg'),
(27, 3, 'uploads/cocina_mabe_frente.jpg'),
(28, 3, 'uploads/cocina_mabe_lateral.jpg'),
(29, 3, 'uploads/cocina_mabe_detalle.jpg'),
(30, 4, 'uploads/cocina_indurama_frente.jpg'),
(31, 4, 'uploads/cocina_indurama_lateral.jpg'),
(32, 4, 'uploads/cocina_indurama_superficie.jpg'),
(33, 5, 'uploads/lavadora_lg_frente.jpg'),
(34, 5, 'uploads/lavadora_lg_lateral.jpg'),
(35, 5, 'uploads/lavadora_lg_tapa.jpg'),
(36, 6, 'uploads/lavadora_samsung_frente.jpg'),
(37, 6, 'uploads/lavadora_samsung_lateral.jpg'),
(38, 6, 'uploads/lavadora_samsung_detalle.jpg'),
(39, 7, 'uploads/smarttv_samsung_frente.jpg'),
(40, 7, 'uploads/smarttv_samsung_lateral.jpg'),
(41, 7, 'uploads/smarttv_samsung_pantalla.jpg'),
(42, 8, 'uploads/smarttv_lg_frente.jpg'),
(43, 8, 'uploads/smarttv_lg_lateral.jpg'),
(44, 8, 'uploads/smarttv_lg_pantalla.jpg'),
(45, 9, 'uploads/licuadora_oster_frente.jpg'),
(46, 9, 'uploads/licuadora_oster_lateral.jpg'),
(47, 9, 'uploads/licuadora_oster_vaso.jpg'),
(48, 10, 'uploads/microondas_panasonic_frente.jpg'),
(49, 10, 'uploads/microondas_panasonic_lateral.jpg'),
(50, 10, 'uploads/microondas_panasonic_interior.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `categoria_id` int(11) DEFAULT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `nombre`, `precio`, `categoria_id`, `descripcion`) VALUES
(1, 'Refrigeradora Samsung 300L', 1500.00, 1, 'Refrigeradora Samsung de 300 litros con sistema de enfriamiento uniforme y ahorro de energía. Ideal para familias medianas.'),
(2, 'Refrigeradora LG No Frost 250L', 1800.00, 1, 'Refrigeradora LG No Frost de 250 litros con tecnología Multi Air Flow que mantiene los alimentos frescos por más tiempo.'),
(3, 'Cocina Mabe 4 Hornillas', 850.00, 2, 'Cocina Mabe de 4 hornillas a gas, diseño compacto y resistente, perfecta para un uso diario en el hogar.'),
(4, 'Cocina Indurama Vitrocerámica', 1200.00, 2, 'Cocina Indurama con superficie vitrocerámica, moderna, fácil de limpiar y con controles digitales de temperatura.'),
(5, 'Lavadora LG 18kg', 1600.00, 3, 'Lavadora LG de 18kg de capacidad, con sistema Smart Inverter y programas automáticos de lavado eficiente.'),
(6, 'Lavadora Samsung EcoBubble 15kg', 1750.00, 3, 'Lavadora Samsung EcoBubble de 15kg, con burbujas de aire que mejoran el lavado y protegen las prendas delicadas.'),
(7, 'Smart TV Samsung 55\"', 2200.00, 4, 'Smart TV Samsung de 55 pulgadas, pantalla 4K UHD, con sistema operativo Tizen y acceso a aplicaciones de streaming.'),
(8, 'Smart TV LG 65\"', 3500.00, 4, 'Smart TV LG de 65 pulgadas, resolución 4K UHD, procesador inteligente α7 y compatible con Dolby Vision y HDR10.'),
(9, 'Licuadora Oster 3 Velocidades', 250.00, 5, 'Licuadora Oster con 3 velocidades, vaso de vidrio resistente de 1.5 litros y cuchillas de acero inoxidable.'),
(10, 'Microondas Panasonic 23L', 450.00, 5, 'Microondas Panasonic de 23 litros con 8 funciones automáticas de cocción, descongelado rápido y diseño compacto.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `password` char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `usuario`, `password`) VALUES
(1, 'carlos', '1234'),
(2, 'maria', 'e2fc714c4727ee9395f324cd2e7f331f');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `imagenes_productos`
--
ALTER TABLE `imagenes_productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoria_id` (`categoria_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario` (`usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `imagenes_productos`
--
ALTER TABLE `imagenes_productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `imagenes_productos`
--
ALTER TABLE `imagenes_productos`
  ADD CONSTRAINT `imagenes_productos_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
