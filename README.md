# TecnoExpress — Tienda en línea (HTML + CSS + JavaScript + Supabase)

Proyecto web de la tienda de accesorios tecnológicos **TecnoExpress**, construido con
HTML, CSS y JavaScript puro (sin frameworks) y conectado a una base de datos
**Supabase** (PostgreSQL). Está listo para abrirse en **Visual Studio Code** y
publicarse en internet.

## 📁 Estructura del proyecto

```
tecnoexpress/
├── index.html            # Página principal
├── catalogo.html         # Catálogo con filtro por categoría
├── producto.html         # Ficha de producto (?id=)
├── carrito.html          # Carrito de compras
├── checkout.html         # Datos de envío y método de pago
├── confirmacion.html     # Confirmación del pedido (?code=)
├── css/
│   └── styles.css        # Estilos (diseño mobile-first)
├── js/
│   ├── config.js         # ⚙️ Aquí pones tus llaves de Supabase
│   ├── supabaseClient.js # Inicializa el cliente de Supabase
│   ├── data.js           # Consultas a la base de datos (con datos de respaldo)
│   ├── cart.js           # Lógica del carrito (localStorage)
│   ├── layout.js         # Cabecera y pie de página compartidos
│   ├── main.js           # Página principal
│   ├── catalogo.js
│   ├── producto.js
│   ├── carrito.js
│   ├── checkout.js
│   └── confirmacion.js
├── supabase/
│   └── schema.sql        # 🗄️ Tablas, políticas y datos de ejemplo
└── README.md
```

## 🧰 Tecnologías

- HTML5, CSS3, JavaScript (ES6) sin frameworks
- Supabase (PostgreSQL + API REST automática + librería `@supabase/supabase-js`)
- `localStorage` para el carrito de compras

## 👥 Grupo 02 — E-Business y Analítica Web (UPN, 2026)
