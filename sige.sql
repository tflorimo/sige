-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 14-12-2021 a las 01:31:11
-- Versión del servidor: 10.1.38-MariaDB
-- Versión de PHP: 5.6.40

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sige`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pago_metodos`
--

CREATE TABLE `pago_metodos` (
  `idmetodo` int(11) NOT NULL,
  `descrip` varchar(200) COLLATE utf8_spanish_ci NOT NULL,
  `descuento` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `pago_metodos`
--

INSERT INTO `pago_metodos` (`idmetodo`, `descrip`, `descuento`) VALUES
(1, 'Efectivo', 15),
(2, 'Tarjeta de debito', 5),
(3, 'Transferencia', 10),
(4, 'Tarjeta de credito', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `idproducto` int(11) NOT NULL,
  `descrip` varchar(200) COLLATE utf8_spanish_ci NOT NULL,
  `idcategoria` int(11) NOT NULL,
  `precio` int(11) NOT NULL,
  `stock_disponible` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`idproducto`, `descrip`, `idcategoria`, `precio`, `stock_disponible`) VALUES
(1, 'Teclado Keychron K2V2', 1, 3007, 0),
(2, 'EVGA NVIDIA GeForce RTX 3060 XC Gaming', 2, 150000, 6),
(3, 'ASUS TUF Gaming VG27AQ', 3, 134000, 80),
(4, 'Intel Core i7 8700', 4, 47000, 11),
(5, 'Logitech G502', 1, 3000, 488),
(6, 'PNY NVIDIA GeForce RTX 2060 Super', 2, 187000, 0),
(7, 'LG 24MP59G', 3, 184000, 250),
(8, 'Intel Core i7 10700k', 4, 84000, 8),
(9, 'Kingston HyperX Revolver S', 5, 696, 100),
(10, 'Bose genericos', 5, 8000, 0),
(11, 'Kingston HyperX Alloy Blue', 1, 10000, 68);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos_categorias`
--

CREATE TABLE `productos_categorias` (
  `idcategoria` int(11) NOT NULL,
  `descrip` varchar(200) COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `productos_categorias`
--

INSERT INTO `productos_categorias` (`idcategoria`, `descrip`) VALUES
(1, 'Perifericos'),
(2, 'Placas de Video'),
(3, 'Monitores'),
(4, 'Procesadores'),
(5, 'Auriculares'),
(6, 'Gabinetes');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `idusuario` int(11) NOT NULL,
  `login` varchar(200) COLLATE utf8_spanish_ci NOT NULL,
  `clave` varchar(200) COLLATE utf8_spanish_ci NOT NULL,
  `nombre_completo` varchar(200) COLLATE utf8_spanish_ci NOT NULL,
  `telefono` varchar(200) COLLATE utf8_spanish_ci NOT NULL,
  `email` varchar(200) COLLATE utf8_spanish_ci NOT NULL,
  `genero` tinyint(1) NOT NULL COMMENT '0 si es hombre, 1 si es mujer',
  `admin` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`idusuario`, `login`, `clave`, `nombre_completo`, `telefono`, `email`, `genero`, `admin`) VALUES
(10, 'sarasa', '12345', 'Jose Dan', '12345', 'josedan@gmail.com', 0, 0),
(14, 'juan', '12345', 'Juan Pablo Vercesi', '1599887766', 'juan.vercesi@ort.edu.ar', 0, 0),
(15, 'scosta', '1234a', 'Siro Costa', '54911234', 'costa.siro@gmail.com', 0, 0),
(16, 'LRosas', '12345', 'Lucas Rosas', '951357', 'lucas.rosas@pdlc.gob.ar', 0, 0),
(28, 'tomas', '1234', 'Tomas Florimo', '1140943167', 'tflorimo@gmail.com', 0, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `pago_metodos`
--
ALTER TABLE `pago_metodos`
  ADD PRIMARY KEY (`idmetodo`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`idproducto`),
  ADD KEY `idcategoria` (`idcategoria`);

--
-- Indices de la tabla `productos_categorias`
--
ALTER TABLE `productos_categorias`
  ADD PRIMARY KEY (`idcategoria`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`idusuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `pago_metodos`
--
ALTER TABLE `pago_metodos`
  MODIFY `idmetodo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `idproducto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `productos_categorias`
--
ALTER TABLE `productos_categorias`
  MODIFY `idcategoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `idusuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
