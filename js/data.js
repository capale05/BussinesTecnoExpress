// Capa de datos: usa Supabase si está configurado; si no, datos de ejemplo.
const SEED_CATEGORIES = [
  { slug:"perifericos",    name:"Periféricos",                description:"Teclados, mouse, audífonos y webcams" },
  { slug:"almacenamiento", name:"Almacenamiento y conectividad", description:"SSD, USB, hubs y adaptadores" },
  { slug:"ergonomia",      name:"Protección y ergonomía",      description:"Fundas, soportes y láminas" },
  { slug:"cargadores",     name:"Cargadores y cables",         description:"Carga rápida, USB-C y HDMI" }
];

const SEED_PRODUCTS = [
  { id:1,  name:"Teclado mecánico RGB inalámbrico",   slug:"teclado-mecanico-rgb",    category:"perifericos",    price:129, old_price:159, rating:4.8, reviews_count:214, stock:25, badge:"-20%",  is_bestseller:true,  image_url:null, description:"Teclado mecánico inalámbrico con switches rojos, iluminación RGB programable y batería de larga duración. Ideal para estudiar y trabajar.", specs:{"Conexión":"Bluetooth 5.1 / USB-C","Switches":"Mecánicos Red","Iluminación":"RGB programable","Batería":"Hasta 120 h","Distribución":"Español (Latam)","Garantía":"12 meses"} },
  { id:2,  name:"Mouse inalámbrico ergonómico",        slug:"mouse-ergonomico",        category:"perifericos",    price:59,  old_price:null, rating:4.6, reviews_count:132, stock:40, badge:null,    is_bestseller:false, image_url:null, description:"Mouse ergonómico silencioso con sensor de alta precisión y conexión por receptor USB de 2.4 GHz.", specs:{} },
  { id:3,  name:"Audífonos con cancelación de ruido",  slug:"audifonos-microfono",     category:"perifericos",    price:99,  old_price:null, rating:4.7, reviews_count:173, stock:30, badge:null,    is_bestseller:true,  image_url:null, description:"Audífonos con micrófono con cancelación de ruido, ideales para clases virtuales y reuniones de trabajo.", specs:{} },
  { id:4,  name:"Webcam Full HD 1080p",                slug:"webcam-1080p",            category:"perifericos",    price:89,  old_price:null, rating:4.5, reviews_count:76,  stock:18, badge:null,    is_bestseller:false, image_url:null, description:"Webcam Full HD 1080p con micrófono integrado y corrección de luz automática.", specs:{} },
  { id:5,  name:"SSD externo 1TB USB-C 1050MB/s",     slug:"ssd-externo-1tb",         category:"almacenamiento", price:289, old_price:null, rating:4.8, reviews_count:98,  stock:15, badge:"Nuevo", is_bestseller:true,  image_url:null, description:"Disco SSD externo de 1TB con interfaz USB-C y velocidades de hasta 1050 MB/s. Compacto y resistente.", specs:{"Capacidad":"1 TB","Interfaz":"USB-C 3.2","Velocidad":"Hasta 1050 MB/s","Compatibilidad":"Windows / macOS","Garantía":"24 meses"} },
  { id:6,  name:"Memoria USB 128GB 3.2",               slug:"usb-128gb",               category:"almacenamiento", price:45,  old_price:null, rating:4.4, reviews_count:210, stock:60, badge:null,    is_bestseller:false, image_url:null, description:"Memoria USB de 128GB con interfaz 3.2 de alta velocidad y diseño metálico.", specs:{} },
  { id:7,  name:"Hub USB-C 7 en 1",                   slug:"hub-usb-c-7en1",          category:"almacenamiento", price:119, old_price:139, rating:4.6, reviews_count:64,  stock:22, badge:"-14%",  is_bestseller:false, image_url:null, description:"Hub multipuerto USB-C 7 en 1 con HDMI 4K, lectores SD y puertos USB 3.0.", specs:{} },
  { id:8,  name:"Soporte regulable para laptop",       slug:"soporte-laptop",          category:"ergonomia",      price:79,  old_price:null, rating:4.7, reviews_count:88,  stock:35, badge:null,    is_bestseller:true,  image_url:null, description:"Soporte de aluminio regulable en altura y ángulo, mejora la postura y la ventilación de la laptop.", specs:{} },
  { id:9,  name:'Funda para laptop 14"',               slug:"funda-laptop-14",         category:"ergonomia",      price:49,  old_price:null, rating:4.5, reviews_count:120, stock:50, badge:null,    is_bestseller:false, image_url:null, description:"Funda acolchada resistente al agua para laptops de hasta 14 pulgadas.", specs:{} },
  { id:10, name:'Lámina de privacidad 15.6"',          slug:"lamina-privacidad",       category:"ergonomia",      price:39,  old_price:null, rating:4.3, reviews_count:41,  stock:28, badge:null,    is_bestseller:false, image_url:null, description:"Lámina de privacidad antirreflejo para pantallas de 15.6 pulgadas.", specs:{} },
  { id:11, name:"Cargador de pared 65W GaN",           slug:"cargador-65w-gan",        category:"cargadores",     price:79,  old_price:93,  rating:4.6, reviews_count:142, stock:33, badge:"-15%",  is_bestseller:true,  image_url:null, description:"Cargador de pared 65W con tecnología GaN y carga rápida para laptop, tablet y celular.", specs:{"Potencia":"65W","Tecnología":"GaN","Puertos":"2x USB-C, 1x USB-A","Carga rápida":"PD 3.0","Garantía":"12 meses"} },
  { id:12, name:"Cable USB-C a USB-C 100W 2m",         slug:"cable-usb-c-100w",        category:"cargadores",     price:35,  old_price:null, rating:4.5, reviews_count:167, stock:70, badge:null,    is_bestseller:false, image_url:null, description:"Cable USB-C a USB-C de 2 metros con soporte de carga de hasta 100W y transferencia de datos.", specs:{} },
  { id:13, name:"Pad mouse XXL gaming",                slug:"pad-mouse-xxl",           category:"perifericos",    price:55,  old_price:null, rating:4.6, reviews_count:89,  stock:45, badge:"Nuevo", is_bestseller:false, image_url:null, description:"Pad mouse extra grande de 90x40cm con base antideslizante y bordes cosidos.", specs:{} },
  { id:14, name:"Auriculares gaming 7.1 RGB",          slug:"auriculares-gaming",      category:"perifericos",    price:149, old_price:179, rating:4.5, reviews_count:63,  stock:20, badge:"-17%",  is_bestseller:false, image_url:null, description:"Auriculares gaming con sonido envolvente 7.1, micrófono retráctil e iluminación RGB.", specs:{"Driver":"50mm","Respuesta de frecuencia":"20Hz-20kHz","Impedancia":"32 Ohm","Garantía":"12 meses"} },
  { id:15, name:"Adaptador USB-C a HDMI 4K",           slug:"adaptador-usb-c-hdmi",    category:"almacenamiento", price:49,  old_price:null, rating:4.4, reviews_count:112, stock:38, badge:null,    is_bestseller:false, image_url:null, description:"Adaptador USB-C a HDMI con soporte para resolución 4K@60Hz. Compatible con MacBook y laptops.", specs:{} },
  { id:16, name:"Cargador inalámbrico 15W Qi",         slug:"cargador-inalambrico-15w",category:"cargadores",     price:69,  old_price:null, rating:4.3, reviews_count:54,  stock:30, badge:"Nuevo", is_bestseller:false, image_url:null, description:"Cargador inalámbrico Qi de 15W compatible con iPhone, Samsung y cualquier dispositivo Qi.", specs:{"Potencia":"15W máx","Compatibilidad":"Qi universal","Cable":"USB-C incluido","Garantía":"12 meses"} }
];

const Data = {
  async getCategories() {
    if (TX.enabled) {
      const { data, error } = await TX.client.from("categories").select("*").order("name");
      if (!error && data) return data;
      console.error(error);
    }
    return SEED_CATEGORIES;
  },

  async getProducts({ category = null, bestsellers = false } = {}) {
    if (TX.enabled) {
      let q = TX.client.from("products").select("*");
      if (category) q = q.eq("category", category);
      if (bestsellers) q = q.eq("is_bestseller", true);
      const { data, error } = await q.order("id");
      if (!error && data) return data;
      console.error(error);
    }
    let list = SEED_PRODUCTS.slice();
    if (category) list = list.filter(p => p.category === category);
    if (bestsellers) list = list.filter(p => p.is_bestseller);
    return list;
  },

  async getProductById(id) {
    id = Number(id);
    if (TX.enabled) {
      const { data, error } = await TX.client.from("products").select("*").eq("id", id).single();
      if (!error && data) return data;
      console.error(error);
    }
    return SEED_PRODUCTS.find(p => p.id === id) || null;
  },

  async createOrder(order, items) {
    const code = "TX-" + new Date().getFullYear() + "-" + Math.floor(10000 + Math.random() * 89999);
    order.code = code;
    if (TX.enabled) {
      const rows = items.map(it => ({
        product_id: it.id, product_name: it.name,
        unit_price: it.price, quantity: it.qty
      }));
      const { error } = await TX.client.rpc("create_order", { p_order: order, p_items: rows });
      if (error) { console.error(error); throw error; }
    }
    localStorage.setItem("tx_last_order", JSON.stringify({ order, items }));
    return code;
  },

  async getOrderByCode(code) {
    if (TX.enabled) {
      const { data, error } = await TX.client.rpc("get_order_by_code", { p_code: code });
      if (!error && data && data.length && data[0].order_data) {
        return { order: data[0].order_data, items: data[0].items_data || [] };
      }
    }
    const local = JSON.parse(localStorage.getItem("tx_last_order") || "null");
    if (local && local.order.code === code) return local;
    return null;
  },

  // ─── Admin CRUD ───────────────────────────────────────────
  async getAllProductsAdmin() {
    if (TX.enabled) {
      const { data, error } = await TX.client.from("products").select("*").order("id");
      if (!error && data) return data;
    }
    return SEED_PRODUCTS.slice();
  },

  async createProduct(product) {
    if (!product.rating) product.rating = 0;
    if (!product.reviews_count) product.reviews_count = 0;
    if (TX.enabled) {
      const maxId = SEED_PRODUCTS.reduce((m, p) => Math.max(m, p.id), 0);
      product.id = maxId + 1;
      const { data, error } = await TX.client.from("products").insert(product).select().single();
      if (error) throw error;
      SEED_PRODUCTS.push(data);
      return data;
    }
    const newId = Math.max(...SEED_PRODUCTS.map(p => p.id), 0) + 1;
    const newP = { ...product, id: newId };
    SEED_PRODUCTS.push(newP);
    return newP;
  },

  async updateProduct(id, updates) {
    if (TX.enabled) {
      const { data, error } = await TX.client.from("products").update(updates).eq("id", id).select().single();
      if (error) throw error;
      const idx = SEED_PRODUCTS.findIndex(p => p.id === id);
      if (idx >= 0) SEED_PRODUCTS[idx] = data;
      return data;
    }
    const idx = SEED_PRODUCTS.findIndex(p => p.id === id);
    if (idx >= 0) Object.assign(SEED_PRODUCTS[idx], updates);
    return SEED_PRODUCTS[idx];
  },

  async deleteProduct(id) {
    if (TX.enabled) {
      const { error } = await TX.client.from("products").delete().eq("id", id);
      if (error) throw error;
    }
    const idx = SEED_PRODUCTS.findIndex(p => p.id === id);
    if (idx >= 0) SEED_PRODUCTS.splice(idx, 1);
    return true;
  },

  async getAllOrders() {
    if (TX.enabled) {
      const { data, error } = await TX.client.from("orders").select("*").order("created_at", { ascending: false });
      if (!error && data) return data;
    }
    return [];
  },

  async getAllOrderItems() {
    if (TX.enabled) {
      const { data, error } = await TX.client.from("order_items").select("*");
      if (!error && data) return data;
    }
    return [];
  },

  async updateOrderStatus(id, status) {
    if (TX.enabled) {
      const { data, error } = await TX.client.from("orders").update({ status }).eq("id", id).select().single();
      if (error) throw error;
      return data;
    }
    return null;
  },

  async createCategory(category) {
    if (TX.enabled) {
      const { data, error } = await TX.client.from("categories").insert(category).select().single();
      if (error) throw error;
      SEED_CATEGORIES.push(data);
      return data;
    }
    SEED_CATEGORIES.push(category);
    return category;
  },

  async updateCategory(slug, updates) {
    if (TX.enabled) {
      const { data, error } = await TX.client.from("categories").update(updates).eq("slug", slug).select().single();
      if (error) throw error;
      const idx = SEED_CATEGORIES.findIndex(c => c.slug === slug);
      if (idx >= 0) Object.assign(SEED_CATEGORIES[idx], data);
      return data;
    }
    const idx = SEED_CATEGORIES.findIndex(c => c.slug === slug);
    if (idx >= 0) Object.assign(SEED_CATEGORIES[idx], updates);
    return SEED_CATEGORIES[idx];
  },

  async deleteCategory(slug) {
    if (TX.enabled) {
      const { error } = await TX.client.from("categories").delete().eq("slug", slug);
      if (error) throw error;
    }
    const idx = SEED_CATEGORIES.findIndex(c => c.slug === slug);
    if (idx >= 0) SEED_CATEGORIES.splice(idx, 1);
    return true;
  },

  async getSettings() {
    if (TX.enabled) {
      const { data, error } = await TX.client.from("site_settings").select("*");
      if (!error && data) return Object.fromEntries(data.map(s => [s.key, s.value]));
    }
    return {};
  },

  async updateSetting(key, value) {
    if (TX.enabled) {
      const { error } = await TX.client.from("site_settings").upsert({ key, value }, { onConflict: "key" });
      if (error) throw error;
    }
  }
};
