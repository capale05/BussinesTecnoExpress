-- ============================================================
--  TecnoExpress — Actualización: registro de pedidos + admin
--  Ejecuta este script completo en: Supabase → SQL Editor → New query
--  (después de haber corrido supabase_setup.sql)
-- ============================================================

-- 1) Función segura para crear pedidos desde el checkout.
--    Inserta el pedido y sus items en una sola transacción, sin
--    necesitar que el rol anon pueda leer/escribir las tablas.
create or replace function create_order(p_order jsonb, p_items jsonb)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id bigint;
begin
  insert into orders (code, customer_name, customer_phone, city, address,
                      payment_method, subtotal, shipping, discount, total, status)
  values (
    p_order->>'code',
    p_order->>'customer_name',
    p_order->>'customer_phone',
    p_order->>'city',
    p_order->>'address',
    p_order->>'payment_method',
    (p_order->>'subtotal')::numeric,
    (p_order->>'shipping')::numeric,
    (p_order->>'discount')::numeric,
    (p_order->>'total')::numeric,
    coalesce(p_order->>'status', 'pendiente')
  )
  returning id into v_id;

  insert into order_items (order_id, product_id, product_name, unit_price, quantity)
  select v_id,
         (it->>'product_id')::bigint,
         it->>'product_name',
         (it->>'unit_price')::numeric,
         (it->>'quantity')::int
  from jsonb_array_elements(p_items) as it;

  return p_order->>'code';
end;
$$;

grant execute on function create_order(jsonb, jsonb) to anon, authenticated;

-- 2) Ya no se necesita que anon inserte directo en las tablas
--    (el checkout ahora pasa por create_order), así que quitamos
--    esas políticas para dejar la BD más cerrada.
drop policy if exists "public_insert_orders"      on orders;
drop policy if exists "public_insert_order_items" on order_items;

-- 3) Políticas de lectura para el panel admin (faltaban en el setup:
--    sin esto, "Pedidos recientes" del dashboard sale vacío aunque
--    existan pedidos).
create policy "admin_read_orders"      on orders      for select to authenticated using (true);
create policy "admin_read_order_items" on order_items for select to authenticated using (true);
