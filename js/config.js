// ============================================================
//  CONFIGURACIÓN DE SUPABASE
//  Reemplaza los valores con los de tu proyecto:
//  Supabase → Project Settings → API
// ============================================================
const SUPABASE_URL = "https://nxplmgwnuirdibhnnhmn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54cGxtZ3dudWlyZGliaG5uaG1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxMTE5NzMsImV4cCI6MjA5ODY4Nzk3M30.8CvPxjhZAXJVUrdDlsZscUPO5VrfWlpX-0vF049XlgI";

// El acceso al panel de administración ahora se valida con Supabase Auth
// (Authentication → Users, en tu proyecto de Supabase). Ya no hay una
// contraseña fija en el código.

// Bucket público de Supabase Storage con las fotos de productos.
// Cada archivo debe llamarse exactamente "<slug-del-producto>.png".
const PRODUCT_IMAGES_BUCKET = "product-images";

// Devuelve la URL de la imagen de un producto: usa la columna image_url
// si está definida, o si no arma la URL a partir del slug del producto.
function productImageUrl(p) {
  if (!p) return null;
  if (p.image_url) return p.image_url;
  if (!p.slug) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/${p.slug}.png`;
}
