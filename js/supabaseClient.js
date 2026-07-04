// Inicializa el cliente de Supabase. Si aún no configuraste tus llaves,
// el sitio funciona con datos de ejemplo (modo demo).
window.TX = { client: null, enabled: false };

(function () {
  const configurado = SUPABASE_URL && !SUPABASE_URL.startsWith("TU_") &&
                      SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.startsWith("TU_");
  if (configurado && window.supabase) {
    window.TX.client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    window.TX.enabled = true;
    console.info("%cTecnoExpress conectado a Supabase ✔", "color:#10B5A5;font-weight:bold");
  } else {
    console.warn("TecnoExpress en MODO DEMO (sin Supabase). Edita js/config.js para conectar la base de datos.");
  }
})();
