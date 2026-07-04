-- ============================================================
--  TecnoExpress — Esquema SQL Server (T-SQL)
--  Ejecuta este script completo en:
--  SQL Server Management Studio (SSMS) o Azure Data Studio
-- ============================================================

-- Limpieza en orden correcto (primero las que tienen FK)
IF OBJECT_ID('dbo.order_items',   'U') IS NOT NULL DROP TABLE dbo.order_items;
IF OBJECT_ID('dbo.orders',        'U') IS NOT NULL DROP TABLE dbo.orders;
IF OBJECT_ID('dbo.products',      'U') IS NOT NULL DROP TABLE dbo.products;
IF OBJECT_ID('dbo.categories',    'U') IS NOT NULL DROP TABLE dbo.categories;
IF OBJECT_ID('dbo.site_settings', 'U') IS NOT NULL DROP TABLE dbo.site_settings;
GO

-- ─── Tabla: categories ───────────────────────────────────────
CREATE TABLE categories (
  slug        NVARCHAR(100) NOT NULL,
  name        NVARCHAR(200) NOT NULL,
  description NVARCHAR(500) NULL,
  CONSTRAINT PK_categories PRIMARY KEY (slug)
);
GO

-- ─── Tabla: products ─────────────────────────────────────────
CREATE TABLE products (
  id            BIGINT         NOT NULL,
  name          NVARCHAR(300)  NOT NULL,
  slug          NVARCHAR(300)  NOT NULL,
  category      NVARCHAR(100)  NULL,
  price         DECIMAL(10,2)  NOT NULL,
  old_price     DECIMAL(10,2)  NULL,
  rating        DECIMAL(3,1)   NOT NULL DEFAULT 0,
  reviews_count INT            NOT NULL DEFAULT 0,
  stock         INT            NOT NULL DEFAULT 0,
  badge         NVARCHAR(50)   NULL,
  is_bestseller BIT            NOT NULL DEFAULT 0,
  image_url     NVARCHAR(1000) NULL,
  description   NVARCHAR(MAX)  NULL,
  specs         NVARCHAR(MAX)  NOT NULL DEFAULT N'{}',
  CONSTRAINT PK_products      PRIMARY KEY (id),
  CONSTRAINT UQ_products_slug UNIQUE (slug),
  CONSTRAINT FK_products_cat  FOREIGN KEY (category) REFERENCES categories(slug)
);
GO

-- ─── Tabla: orders ───────────────────────────────────────────
CREATE TABLE orders (
  id             BIGINT        IDENTITY(1,1) NOT NULL,
  code           NVARCHAR(50)  NOT NULL,
  customer_name  NVARCHAR(200) NOT NULL,
  customer_phone NVARCHAR(50)  NULL,
  city           NVARCHAR(100) NULL,
  address        NVARCHAR(300) NULL,
  payment_method NVARCHAR(50)  NULL,
  subtotal       DECIMAL(10,2) NULL,
  shipping       DECIMAL(10,2) NULL,
  discount       DECIMAL(10,2) NULL,
  total          DECIMAL(10,2) NULL,
  status         NVARCHAR(50)  NOT NULL DEFAULT N'pendiente',
  created_at     DATETIME2     NOT NULL DEFAULT GETDATE(),
  CONSTRAINT PK_orders      PRIMARY KEY (id),
  CONSTRAINT UQ_orders_code UNIQUE (code)
);
GO

-- ─── Tabla: order_items ──────────────────────────────────────
CREATE TABLE order_items (
  id           BIGINT        IDENTITY(1,1) NOT NULL,
  order_id     BIGINT        NULL,
  product_id   BIGINT        NULL,
  product_name NVARCHAR(300) NULL,
  unit_price   DECIMAL(10,2) NULL,
  quantity     INT           NULL,
  CONSTRAINT PK_order_items    PRIMARY KEY (id),
  CONSTRAINT FK_items_order    FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  CONSTRAINT FK_items_product  FOREIGN KEY (product_id) REFERENCES products(id)
);
GO

-- ─── Tabla: site_settings ────────────────────────────────────
CREATE TABLE site_settings (
  [key]  NVARCHAR(100) NOT NULL,
  value  NVARCHAR(MAX) NULL,
  CONSTRAINT PK_site_settings PRIMARY KEY ([key])
);
GO

-- ─── Datos: categorías ───────────────────────────────────────
INSERT INTO categories (slug, name, description) VALUES
  ('perifericos',    N'Periféricos',                   N'Teclados, mouse, audífonos y webcams'),
  ('almacenamiento', N'Almacenamiento y conectividad',  N'SSD, USB, hubs y adaptadores'),
  ('ergonomia',      N'Protección y ergonomía',         N'Fundas, soportes y láminas'),
  ('cargadores',     N'Cargadores y cables',            N'Carga rápida, USB-C y HDMI');
GO

-- ─── Datos: productos ────────────────────────────────────────
INSERT INTO products
  (id, name, slug, category, price, old_price, rating, reviews_count, stock, badge, is_bestseller, image_url, description, specs)
VALUES
(1, N'Teclado mecánico RGB inalámbrico', 'teclado-mecanico-rgb', 'perifericos',
    129.00, 159.00, 4.8, 214, 25, '-20%', 1, NULL,
    N'Teclado mecánico inalámbrico con switches rojos, iluminación RGB programable y batería de larga duración. Ideal para estudiar y trabajar.',
    N'{"Conexión":"Bluetooth 5.1 / USB-C","Switches":"Mecánicos Red","Iluminación":"RGB programable","Batería":"Hasta 120 h","Distribución":"Español (Latam)","Garantía":"12 meses"}');

INSERT INTO products
  (id, name, slug, category, price, old_price, rating, reviews_count, stock, badge, is_bestseller, image_url, description, specs)
VALUES
(2, N'Mouse inalámbrico ergonómico', 'mouse-ergonomico', 'perifericos',
    59.00, NULL, 4.6, 132, 40, NULL, 0, NULL,
    N'Mouse ergonómico silencioso con sensor de alta precisión y conexión por receptor USB de 2.4 GHz.',
    N'{}');

INSERT INTO products
  (id, name, slug, category, price, old_price, rating, reviews_count, stock, badge, is_bestseller, image_url, description, specs)
VALUES
(3, N'Audífonos con cancelación de ruido', 'audifonos-microfono', 'perifericos',
    99.00, NULL, 4.7, 173, 30, NULL, 1, NULL,
    N'Audífonos con micrófono con cancelación de ruido, ideales para clases virtuales y reuniones de trabajo.',
    N'{}');

INSERT INTO products
  (id, name, slug, category, price, old_price, rating, reviews_count, stock, badge, is_bestseller, image_url, description, specs)
VALUES
(4, N'Webcam Full HD 1080p', 'webcam-1080p', 'perifericos',
    89.00, NULL, 4.5, 76, 18, NULL, 0, NULL,
    N'Webcam Full HD 1080p con micrófono integrado y corrección de luz automática.',
    N'{}');

INSERT INTO products
  (id, name, slug, category, price, old_price, rating, reviews_count, stock, badge, is_bestseller, image_url, description, specs)
VALUES
(5, N'SSD externo 1TB USB-C 1050MB/s', 'ssd-externo-1tb', 'almacenamiento',
    289.00, NULL, 4.8, 98, 15, 'Nuevo', 1, NULL,
    N'Disco SSD externo de 1TB con interfaz USB-C y velocidades de hasta 1050 MB/s. Compacto y resistente.',
    N'{"Capacidad":"1 TB","Interfaz":"USB-C 3.2","Velocidad":"Hasta 1050 MB/s","Compatibilidad":"Windows / macOS","Garantía":"24 meses"}');

INSERT INTO products
  (id, name, slug, category, price, old_price, rating, reviews_count, stock, badge, is_bestseller, image_url, description, specs)
VALUES
(6, N'Memoria USB 128GB 3.2', 'usb-128gb', 'almacenamiento',
    45.00, NULL, 4.4, 210, 60, NULL, 0, NULL,
    N'Memoria USB de 128GB con interfaz 3.2 de alta velocidad y diseño metálico.',
    N'{}');

INSERT INTO products
  (id, name, slug, category, price, old_price, rating, reviews_count, stock, badge, is_bestseller, image_url, description, specs)
VALUES
(7, N'Hub USB-C 7 en 1', 'hub-usb-c-7en1', 'almacenamiento',
    119.00, 139.00, 4.6, 64, 22, '-14%', 0, NULL,
    N'Hub multipuerto USB-C 7 en 1 con HDMI 4K, lectores SD y puertos USB 3.0.',
    N'{}');

INSERT INTO products
  (id, name, slug, category, price, old_price, rating, reviews_count, stock, badge, is_bestseller, image_url, description, specs)
VALUES
(8, N'Soporte regulable para laptop', 'soporte-laptop', 'ergonomia',
    79.00, NULL, 4.7, 88, 35, NULL, 1, NULL,
    N'Soporte de aluminio regulable en altura y ángulo, mejora la postura y la ventilación de la laptop.',
    N'{}');

INSERT INTO products
  (id, name, slug, category, price, old_price, rating, reviews_count, stock, badge, is_bestseller, image_url, description, specs)
VALUES
(9, N'Funda para laptop 14"', 'funda-laptop-14', 'ergonomia',
    49.00, NULL, 4.5, 120, 50, NULL, 0, NULL,
    N'Funda acolchada resistente al agua para laptops de hasta 14 pulgadas.',
    N'{}');

INSERT INTO products
  (id, name, slug, category, price, old_price, rating, reviews_count, stock, badge, is_bestseller, image_url, description, specs)
VALUES
(10, N'Lámina de privacidad 15.6"', 'lamina-privacidad', 'ergonomia',
    39.00, NULL, 4.3, 41, 28, NULL, 0, NULL,
    N'Lámina de privacidad antirreflejo para pantallas de 15.6 pulgadas.',
    N'{}');

INSERT INTO products
  (id, name, slug, category, price, old_price, rating, reviews_count, stock, badge, is_bestseller, image_url, description, specs)
VALUES
(11, N'Cargador de pared 65W GaN', 'cargador-65w-gan', 'cargadores',
    79.00, 93.00, 4.6, 142, 33, '-15%', 1, NULL,
    N'Cargador de pared 65W con tecnología GaN y carga rápida para laptop, tablet y celular.',
    N'{"Potencia":"65W","Tecnología":"GaN","Puertos":"2x USB-C, 1x USB-A","Carga rápida":"PD 3.0","Garantía":"12 meses"}');

INSERT INTO products
  (id, name, slug, category, price, old_price, rating, reviews_count, stock, badge, is_bestseller, image_url, description, specs)
VALUES
(12, N'Cable USB-C a USB-C 100W 2m', 'cable-usb-c-100w', 'cargadores',
    35.00, NULL, 4.5, 167, 70, NULL, 0, NULL,
    N'Cable USB-C a USB-C de 2 metros con soporte de carga de hasta 100W y transferencia de datos.',
    N'{}');

INSERT INTO products
  (id, name, slug, category, price, old_price, rating, reviews_count, stock, badge, is_bestseller, image_url, description, specs)
VALUES
(13, N'Pad mouse XXL gaming', 'pad-mouse-xxl', 'perifericos',
    55.00, NULL, 4.6, 89, 45, 'Nuevo', 0, NULL,
    N'Pad mouse extra grande de 90x40cm con base antideslizante y bordes cosidos.',
    N'{}');

INSERT INTO products
  (id, name, slug, category, price, old_price, rating, reviews_count, stock, badge, is_bestseller, image_url, description, specs)
VALUES
(14, N'Auriculares gaming 7.1 RGB', 'auriculares-gaming', 'perifericos',
    149.00, 179.00, 4.5, 63, 20, '-17%', 0, NULL,
    N'Auriculares gaming con sonido envolvente 7.1, micrófono retráctil e iluminación RGB.',
    N'{"Driver":"50mm","Respuesta":"20Hz-20kHz","Impedancia":"32 Ohm","Garantía":"12 meses"}');

INSERT INTO products
  (id, name, slug, category, price, old_price, rating, reviews_count, stock, badge, is_bestseller, image_url, description, specs)
VALUES
(15, N'Adaptador USB-C a HDMI 4K', 'adaptador-usb-c-hdmi', 'almacenamiento',
    49.00, NULL, 4.4, 112, 38, NULL, 0, NULL,
    N'Adaptador USB-C a HDMI con soporte para resolución 4K@60Hz. Compatible con MacBook y laptops.',
    N'{}');

INSERT INTO products
  (id, name, slug, category, price, old_price, rating, reviews_count, stock, badge, is_bestseller, image_url, description, specs)
VALUES
(16, N'Cargador inalámbrico 15W Qi', 'cargador-inalambrico-15w', 'cargadores',
    69.00, NULL, 4.3, 54, 30, 'Nuevo', 0, NULL,
    N'Cargador inalámbrico Qi de 15W compatible con iPhone, Samsung y cualquier dispositivo Qi.',
    N'{"Potencia":"15W máx","Compatibilidad":"Qi universal","Cable":"USB-C incluido","Garantía":"12 meses"}');
GO

-- ─── Datos: configuración inicial ────────────────────────────
INSERT INTO site_settings ([key], value) VALUES ('store_name',         N'TecnoExpress');
INSERT INTO site_settings ([key], value) VALUES ('tagline',            N'Accesorios tecnológicos al mejor precio');
INSERT INTO site_settings ([key], value) VALUES ('store_email',        N'hola@tecnoexpress.pe');
INSERT INTO site_settings ([key], value) VALUES ('store_phone',        N'+51 999 000 000');
INSERT INTO site_settings ([key], value) VALUES ('store_instagram',    N'@tecnoexpress.pe');
INSERT INTO site_settings ([key], value) VALUES ('whatsapp',           N'51999000000');
INSERT INTO site_settings ([key], value) VALUES ('promo_text',         N'Semana Tecno: 25% en teclados y audífonos seleccionados');
INSERT INTO site_settings ([key], value) VALUES ('hero_title',         N'Accesorios tecnológicos al mejor precio');
INSERT INTO site_settings ([key], value) VALUES ('hero_subtitle',      N'Periféricos y accesorios para estudiantes y trabajo remoto en el Perú');
INSERT INTO site_settings ([key], value) VALUES ('hero_discount',      N'-25%');
INSERT INTO site_settings ([key], value) VALUES ('hero_discount_desc', N'en teclados y audífonos seleccionados');
GO

-- ─── Verificación ─────────────────────────────────────────────
SELECT 'Categorias' AS Tabla, COUNT(*) AS Total FROM categories
UNION ALL
SELECT 'Productos',           COUNT(*)           FROM products
UNION ALL
SELECT 'Configuraciones',     COUNT(*)           FROM site_settings;
GO
