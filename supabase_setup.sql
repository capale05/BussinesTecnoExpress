-- ============================================================
--  TecnoExpress — Configuración de seguridad de Supabase
--  Ejecuta este script completo en: Supabase → SQL Editor → New query
-- ============================================================

-- 1) Asegura que RLS esté activo en todas las tablas
alter table categories    enable row level security;
alter table products      enable row level security;
alter table orders        enable row level security;
alter table order_items   enable row level security;
alter table site_settings enable row level security;

-- 2) Lectura pública (la tienda es visible sin login)
create policy "public_read_categories"    on categories    for select using (true);
create policy "public_read_products"      on products      for select using (true);
create policy "public_read_site_settings" on site_settings for select using (true);

-- 3) Checkout: cualquier visitante puede crear un pedido
create policy "public_insert_orders"      on orders        for insert with check (true);
create policy "public_insert_order_items" on order_items   for insert with check (true);

-- NOTA: a propósito NO hay política de "select" pública sobre orders/order_items.
-- Esas tablas tienen nombre, teléfono y dirección de clientes: si cualquiera
-- pudiera leerlas con la anon key, se filtrarían los datos de TODOS los pedidos.
-- En vez de eso, la búsqueda de "mi pedido por código" pasa por la función
-- get_order_by_code() de abajo, que solo devuelve el pedido cuyo código exacto
-- se le pida (como buscar con una clave, no listar todo).

-- 4) Función segura para "ver mi pedido" en confirmacion.html
create or replace function get_order_by_code(p_code text)
returns table (order_data jsonb, items_data jsonb)
language sql
security definer
set search_path = public
as $$
  select
    to_jsonb(o) as order_data,
    coalesce(
      (select jsonb_agg(oi) from order_items oi where oi.order_id = o.id),
      '[]'::jsonb
    ) as items_data
  from orders o
  where o.code = p_code;
$$;

grant execute on function get_order_by_code(text) to anon, authenticated;

-- 5) Panel admin: solo un usuario autenticado (Supabase Auth) puede escribir
create policy "admin_write_categories"    on categories    for all    to authenticated using (true) with check (true);
create policy "admin_write_products"      on products      for all    to authenticated using (true) with check (true);
create policy "admin_update_orders"       on orders        for update to authenticated using (true) with check (true);
create policy "admin_write_site_settings" on site_settings for all    to authenticated using (true) with check (true);

-- ============================================================
--  Después de correr esto, crea tu usuario admin en:
--  Supabase → Authentication → Users → Add user
--  (marca "Auto Confirm User" para no necesitar verificar el email)
--  Usa ese correo y contraseña para entrar en admin.html
-- ============================================================
