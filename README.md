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

> 💡 El sitio funciona **sin Supabase** usando datos de ejemplo, así puedes verlo
> de inmediato. Al configurar Supabase, los productos y pedidos pasan a la base de datos real.

## ▶️ 1. Abrir y ver el proyecto en VS Code

1. Abre la carpeta `tecnoexpress` en Visual Studio Code.
2. Instala la extensión **Live Server** (de Ritwick Dey).
3. Click derecho sobre `index.html` → **"Open with Live Server"**.
4. Se abrirá en `http://127.0.0.1:5500`. ¡Ya puedes navegar la tienda!

## 🗄️ 2. Crear la base de datos en Supabase

1. Entra a https://supabase.com y crea una cuenta (gratis).
2. Crea un nuevo proyecto (elige una contraseña para la base de datos).
3. En el panel, ve a **SQL Editor** → **New query**.
4. Copia y pega **todo** el contenido de `supabase/schema.sql` y presiona **Run**.
   Esto crea las tablas (`categories`, `products`, `orders`, `order_items`),
   las políticas de seguridad y carga los productos de ejemplo.

## 🔑 3. Conectar el sitio con Supabase

1. En Supabase ve a **Project Settings → API**.
2. Copia el **Project URL** y la **anon public key**.
3. Abre `js/config.js` y reemplaza los valores:

```js
const SUPABASE_URL = "https://xxxxxxxx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOi...";
```

4. Recarga el sitio con Live Server. Ahora los productos se leen de Supabase y
   los pedidos del checkout se guardan en la tabla `orders`.

> La **anon key** es pública y segura siempre que las políticas (RLS) estén activas,
> tal como vienen en `schema.sql`.

## 🌐 4. Subir el sitio a internet

Es un sitio estático, así que puedes publicarlo gratis en cualquiera de estas opciones:

- **Netlify** → arrastra la carpeta en https://app.netlify.com/drop
- **Vercel** → `vercel` o conecta tu repositorio de GitHub
- **GitHub Pages** → sube el proyecto a un repo y actívalo en *Settings → Pages*

La base de datos seguirá viviendo en Supabase, así que no necesitas servidor propio.

## 🧰 Tecnologías

- HTML5, CSS3, JavaScript (ES6) sin frameworks
- Supabase (PostgreSQL + API REST automática + librería `@supabase/supabase-js`)
- `localStorage` para el carrito de compras

## 👥 Grupo 02 — E-Business y Analítica Web (UPN, 2026)
