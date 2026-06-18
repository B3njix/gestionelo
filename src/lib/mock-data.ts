// Datos simulados para Decoraciones Eventos ERP

export type Customer = {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  ciudad: string;
  totalGastado: number;
  ticketPromedio: number;
  eventosTotales: number;
  ultimaFecha: string;
};

export type Product = {
  id: string;
  nombre: string;
  categoria: Category;
  precio: number;
  stockTotal: number;
  stockReservado: number;
  imagen: string;
  descripcion: string;
  variantes?: Record<string, string[]>;
};

export type Category =
  | "Manteles"
  | "Telas"
  | "Mesas"
  | "Sillas"
  | "Iluminación"
  | "Fuente de Chocolate"
  | "Arreglos Florales"
  | "Backdrops"
  | "Centros de Mesa";

export const CATEGORIES: Category[] = [
  "Manteles",
  "Telas",
  "Mesas",
  "Sillas",
  "Iluminación",
  "Fuente de Chocolate",
  "Arreglos Florales",
  "Backdrops",
  "Centros de Mesa",
];

export type EventType = "Boda" | "Cumpleaños" | "Baby Shower" | "Corporativo" | "Graduación";
export const EVENT_TYPES: EventType[] = ["Boda", "Cumpleaños", "Baby Shower", "Corporativo", "Graduación"];

export type EventStatus = "Confirmado" | "Pendiente" | "Cancelado";

export type EventItem = {
  id: string;
  nombre: string;
  clienteId: string;
  cliente: string;
  fecha: string;
  lugar: string;
  invitados: number;
  tipo: EventType;
  estado: EventStatus;
  total: number;
};

export type QuoteStatus = "Borrador" | "Enviada" | "Aprobada" | "Rechazada";
export type Quote = {
  id: string;
  codigo: string;
  clienteId: string;
  cliente: string;
  eventoId?: string;
  fecha: string;
  estado: QuoteStatus;
  subtotal: number;
  descuento: number;
  impuesto: number;
  total: number;
};

const nombres = [
  "María José Hernández","Carlos Alberto Martínez","Sofía Beatriz Ramírez","Juan Pablo Cruz",
  "Andrea Lucía Mejía","Roberto Antonio Flores","Gabriela del Carmen Rivas","Luis Fernando Portillo",
  "Daniela Alejandra Argueta","José Miguel Aguilar","Karla Patricia Mendoza","Diego Armando Reyes",
  "Verónica Estela Cáceres","Ricardo Ernesto Cisneros","Mónica Isabel Solano","Fernando Javier Bonilla",
  "Claudia Elena Granados","Eduardo Antonio Linares","Patricia Carolina Escobar","Mauricio Adolfo Henríquez",
  "Alejandra Marisol Quintanilla","Óscar Eduardo Trejo","Lorena Beatriz Alvarado","Hugo Edgardo Salazar",
  "Rocío del Pilar Vásquez","Sergio Antonio Castillo","Marta Cecilia Lemus","Iván Alberto Domínguez",
  "Wendy Yamileth Calderón","Néstor Mauricio Funes","Tatiana Michelle Ayala","Gerardo Antonio Peña",
  "Susana Margarita Mata","Walter Vladimir Orellana","Cristina Esmeralda Rosales","Manuel Ernesto Galdámez",
  "Brenda Lissette Cardoza","Pedro Antonio Velásquez","Beatriz Eugenia Saldaña","Álvaro Enrique Beltrán",
  "Yesenia Marisol Pineda","Edwin Geovanni Zelaya","Marisol Elizabeth Bernal","Rafael Ignacio Molina",
  "Karina Vanessa Recinos","Jorge Alberto Najarro","Stephany Andrea Cornejo","Luis Alonso Guevara",
  "Cinthya Roxana Méndez","Mario Ernesto Larín",
];

const ciudades = ["San Salvador","Santa Tecla","Antiguo Cuscatlán","Soyapango","San Miguel","Santa Ana","La Libertad","Sonsonate","Ahuachapán","Apopa"];

let seed = 12345;
const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
const randInt = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;

export const customers: Customer[] = nombres.map((nombre, i) => {
  const eventos = randInt(1, 8);
  const total = randInt(500, 12000);
  return {
    id: `CL-${String(i + 1).padStart(4, "0")}`,
    nombre,
    email: nombre.toLowerCase().replace(/\s+/g, ".").replace(/[áéíóúñ]/g, c => ({á:"a",é:"e",í:"i",ó:"o",ú:"u",ñ:"n"}[c]!)) + "@gmail.com",
    telefono: `+503 ${randInt(6,7)}${randInt(100,999)}-${randInt(1000,9999)}`,
    ciudad: pick(ciudades),
    totalGastado: total,
    ticketPromedio: Math.round(total / eventos),
    eventosTotales: eventos,
    ultimaFecha: new Date(2025, randInt(0,11), randInt(1,28)).toISOString(),
  };
});

const productSeeds: { nombre: string; categoria: Category; precio: number; descripcion: string; img: string; variantes?: Record<string,string[]> }[] = [
  // Manteles
  { nombre: "Mantel Redondo Satén", categoria: "Manteles", precio: 12, descripcion: "Mantel redondo de satén premium para mesa de 8 invitados.", img: "linen-round", variantes: { Color: ["Blanco","Dorado","Marfil","Vino","Negro","Rosado"], Tamaño: ["1.80m","2.20m","2.80m"], Material: ["Satén","Lino","Tafetán"] } },
  { nombre: "Mantel Rectangular Lino", categoria: "Manteles", precio: 15, descripcion: "Lino europeo para mesas largas de banquete.", img: "linen-rect", variantes: { Color: ["Blanco","Beige","Verde Salvia","Lavanda"], Tamaño: ["2m","3m","4m"], Material: ["Lino","Algodón"] } },
  { nombre: "Camino de Mesa Bordado", categoria: "Manteles", precio: 8, descripcion: "Camino bordado a mano con motivos florales." , img: "runner" },
  { nombre: "Sobre Mantel Encaje", categoria: "Manteles", precio: 10, descripcion: "Encaje delicado para realzar el mantel base.", img: "lace" },
  // Telas
  { nombre: "Tela Voile Decorativa", categoria: "Telas", precio: 5, descripcion: "Tela ligera para drapeados de techo y paredes.", img: "voile" },
  { nombre: "Tela Tul Premium", categoria: "Telas", precio: 4, descripcion: "Tul brillante para decoración de carpas.", img: "tul" },
  { nombre: "Tela Organza Dorada", categoria: "Telas", precio: 6, descripcion: "Organza con hilos dorados, ideal para bodas.", img: "organza" },
  { nombre: "Tela Terciopelo", categoria: "Telas", precio: 12, descripcion: "Terciopelo de alta gama para eventos elegantes.", img: "velvet" },
  // Mesas
  { nombre: "Mesa Redonda 8 personas", categoria: "Mesas", precio: 18, descripcion: "Mesa redonda plegable para 8 invitados.", img: "table-round" },
  { nombre: "Mesa Imperial 3m", categoria: "Mesas", precio: 35, descripcion: "Mesa imperial larga estilo banquete real.", img: "table-imperial" },
  { nombre: "Mesa Cóctel Alta", categoria: "Mesas", precio: 14, descripcion: "Mesa alta tipo bistró para cócteles.", img: "table-cocktail" },
  { nombre: "Mesa de Postres", categoria: "Mesas", precio: 25, descripcion: "Mesa decorada para mesa de postres.", img: "table-dessert" },
  // Sillas
  { nombre: "Silla Tiffany Cristal", categoria: "Sillas", precio: 4, descripcion: "Silla Tiffany transparente con cojín incluido.", img: "chair-tiffany", variantes: { Color: ["Cristal","Dorada","Plateada","Blanca","Negra"], Cojín: ["Blanco","Marfil","Rosado","Sin cojín"] } },
  { nombre: "Silla Chiavari Dorada", categoria: "Sillas", precio: 5, descripcion: "Clásica Chiavari dorada para bodas.", img: "chair-chiavari", variantes: { Color: ["Dorada","Plateada","Blanca","Madera"], Cojín: ["Blanco","Marfil","Vino"] } },
  { nombre: "Silla Plegable Acolchada", categoria: "Sillas", precio: 2.5, descripcion: "Silla plegable cómoda para eventos masivos.", img: "chair-folding" },
  { nombre: "Banca Lounge", categoria: "Sillas", precio: 22, descripcion: "Banca tipo lounge para área VIP.", img: "lounge" },
  // Iluminación
  { nombre: "Luces Cálidas Serie 10m", categoria: "Iluminación", precio: 25, descripcion: "Cortina de luces cálidas LED.", img: "warm-lights", variantes: { Tipo: ["Cálida","Blanca","RGB"], Longitud: ["10m","20m","50m"] } },
  { nombre: "Luces RGB Inteligentes", categoria: "Iluminación", precio: 45, descripcion: "Iluminación RGB con control DMX.", img: "rgb-lights" },
  { nombre: "Máquina de Humo Profesional", categoria: "Iluminación", precio: 60, descripcion: "Máquina de humo de baja densidad para pistas.", img: "smoke" },
  { nombre: "Letras Gigantes LED", categoria: "Iluminación", precio: 80, descripcion: "Letras gigantes iluminadas (set de 3 letras).", img: "letters" },
  { nombre: "Reflectores PAR LED", categoria: "Iluminación", precio: 30, descripcion: "Reflectores PAR de colores ajustables.", img: "par" },
  // Fuente de Chocolate
  { nombre: "Fuente de Chocolate Mediana", categoria: "Fuente de Chocolate", precio: 120, descripcion: "Fuente para 80 invitados con frutas incluidas.", img: "fountain-m", variantes: { Tamaño: ["Pequeña 50 pax","Mediana 80 pax","Grande 150 pax"], Frutas: ["Fresa","Banano","Piña","Uvas","Marshmallow"], Toppings: ["Chispas","Coco rallado","Nuez","Galleta"] } },
  { nombre: "Fuente de Chocolate Grande", categoria: "Fuente de Chocolate", precio: 180, descripcion: "Fuente premium para 150+ invitados.", img: "fountain-l" },
  { nombre: "Estación de Crepes", categoria: "Fuente de Chocolate", precio: 150, descripcion: "Estación de crepes dulces con chef.", img: "crepes" },
  // Arreglos Florales
  { nombre: "Arreglo Floral Centro Bajo", categoria: "Arreglos Florales", precio: 35, descripcion: "Centro de mesa floral bajo con rosas y eucalipto.", img: "floral-low" },
  { nombre: "Arreglo Floral Alto", categoria: "Arreglos Florales", precio: 75, descripcion: "Arreglo alto en pedestal de cristal.", img: "floral-tall" },
  { nombre: "Arco Floral para Ceremonia", categoria: "Arreglos Florales", precio: 280, descripcion: "Arco floral completo para ceremonia.", img: "arch" },
  { nombre: "Bouquet de Novia", categoria: "Arreglos Florales", precio: 95, descripcion: "Bouquet personalizado para novia.", img: "bouquet" },
  // Backdrops
  { nombre: "Backdrop Panel Flores", categoria: "Backdrops", precio: 220, descripcion: "Panel de flores artificiales 2x2.5m.", img: "backdrop-flowers" },
  { nombre: "Backdrop Globos Orgánico", categoria: "Backdrops", precio: 180, descripcion: "Arco orgánico de globos personalizado.", img: "backdrop-balloons" },
  { nombre: "Backdrop Telón Drapeado", categoria: "Backdrops", precio: 140, descripcion: "Drapeado elegante con iluminación de fondo.", img: "backdrop-drape" },
  // Centros de Mesa
  { nombre: "Centro Candelabro Cristal", categoria: "Centros de Mesa", precio: 28, descripcion: "Candelabro de cristal con velas.", img: "center-candle" },
  { nombre: "Centro Floral con Velas", categoria: "Centros de Mesa", precio: 42, descripcion: "Combinación de flores frescas y velas.", img: "center-floral" },
  { nombre: "Centro Pecera con Orquídeas", categoria: "Centros de Mesa", precio: 38, descripcion: "Pecera de cristal con orquídeas flotantes.", img: "center-fish" },
];

const placeholder = (seed: string) => `https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=70&auto=format&fit=crop&ixid=${seed}`;

const productImages: Record<string, string> = {
  "linen-round": "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=70&auto=format&fit=crop",
  "linen-rect": "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=70&auto=format&fit=crop",
  "runner": "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=600&q=70&auto=format&fit=crop",
  "lace": "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=70&auto=format&fit=crop",
  "voile": "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=70&auto=format&fit=crop",
  "tul": "https://images.unsplash.com/photo-1530023367847-a683933f4172?w=600&q=70&auto=format&fit=crop",
  "organza": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=70&auto=format&fit=crop",
  "velvet": "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&q=70&auto=format&fit=crop",
  "table-round": "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=70&auto=format&fit=crop",
  "table-imperial": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=70&auto=format&fit=crop",
  "table-cocktail": "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600&q=70&auto=format&fit=crop",
  "table-dessert": "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&q=70&auto=format&fit=crop",
  "chair-tiffany": "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=70&auto=format&fit=crop",
  "chair-chiavari": "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&q=70&auto=format&fit=crop",
  "chair-folding": "https://images.unsplash.com/photo-1503602642458-232111445657?w=600&q=70&auto=format&fit=crop",
  "lounge": "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=600&q=70&auto=format&fit=crop",
  "warm-lights": "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?w=600&q=70&auto=format&fit=crop",
  "rgb-lights": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=70&auto=format&fit=crop",
  "smoke": "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=600&q=70&auto=format&fit=crop",
  "letters": "https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=600&q=70&auto=format&fit=crop",
  "par": "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&q=70&auto=format&fit=crop",
  "fountain-m": "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=600&q=70&auto=format&fit=crop",
  "fountain-l": "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=70&auto=format&fit=crop",
  "crepes": "https://images.unsplash.com/photo-1519869325930-281384150729?w=600&q=70&auto=format&fit=crop",
  "floral-low": "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600&q=70&auto=format&fit=crop",
  "floral-tall": "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=70&auto=format&fit=crop",
  "arch": "https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?w=600&q=70&auto=format&fit=crop",
  "bouquet": "https://images.unsplash.com/photo-1525772764200-be829a350797?w=600&q=70&auto=format&fit=crop",
  "backdrop-flowers": "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=70&auto=format&fit=crop",
  "backdrop-balloons": "https://images.unsplash.com/photo-1530103043960-ef38714abb15?w=600&q=70&auto=format&fit=crop",
  "backdrop-drape": "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=600&q=70&auto=format&fit=crop",
  "center-candle": "https://images.unsplash.com/photo-1602522953829-d6e08bdd83c7?w=600&q=70&auto=format&fit=crop",
  "center-floral": "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=600&q=70&auto=format&fit=crop",
  "center-fish": "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=70&auto=format&fit=crop",
};

export const products: Product[] = [];
let pi = 0;
while (products.length < 100) {
  const seed = productSeeds[pi % productSeeds.length];
  const cycle = Math.floor(pi / productSeeds.length);
  const stockTotal = randInt(20, 200);
  products.push({
    id: `PR-${String(products.length + 1).padStart(4, "0")}`,
    nombre: cycle === 0 ? seed.nombre : `${seed.nombre} ${["Premium","Deluxe","Edición Especial"][cycle - 1]}`,
    categoria: seed.categoria,
    precio: cycle === 0 ? seed.precio : Math.round(seed.precio * (1 + cycle * 0.3) * 100) / 100,
    stockTotal,
    stockReservado: randInt(0, Math.floor(stockTotal * 0.7)),
    imagen: productImages[seed.img] || placeholder(seed.img),
    descripcion: seed.descripcion,
    variantes: seed.variantes,
  });
  pi++;
}

const venues = ["Hotel Sheraton Presidente","Hotel Crowne Plaza","Hacienda Los Nogales","Salón Las Magnolias","Club Campestre Cuscatlán","Centro de Convenciones CIFCO","Hotel Barceló San Salvador","Quinta Real","Jardín Botánico La Laguna","Hacienda San José"];

export const events: EventItem[] = Array.from({ length: 30 }, (_, i) => {
  const cliente = pick(customers);
  const tipo = pick(EVENT_TYPES);
  const estado = pick(["Confirmado","Confirmado","Confirmado","Pendiente","Pendiente","Cancelado"] as EventStatus[]);
  const monthOffset = randInt(-2, 5);
  const fecha = new Date(2026, 5 + monthOffset, randInt(1, 28));
  return {
    id: `EV-${String(i + 1).padStart(4, "0")}`,
    nombre: `${tipo} de ${cliente.nombre.split(" ")[0]}`,
    clienteId: cliente.id,
    cliente: cliente.nombre,
    fecha: fecha.toISOString(),
    lugar: pick(venues),
    invitados: randInt(40, 400),
    tipo,
    estado,
    total: randInt(800, 15000),
  };
});

export const quotes: Quote[] = Array.from({ length: 100 }, (_, i) => {
  const cliente = pick(customers);
  const subtotal = randInt(400, 12000);
  const descuento = Math.round(subtotal * (rand() * 0.15) * 100) / 100;
  const impuesto = Math.round((subtotal - descuento) * 0.13 * 100) / 100;
  const total = Math.round((subtotal - descuento + impuesto) * 100) / 100;
  return {
    id: `QT-${String(i + 1).padStart(4, "0")}`,
    codigo: `COT-2026-${String(i + 1).padStart(4, "0")}`,
    clienteId: cliente.id,
    cliente: cliente.nombre,
    fecha: new Date(2026, randInt(0, 11), randInt(1, 28)).toISOString(),
    estado: pick(["Borrador","Enviada","Enviada","Aprobada","Aprobada","Rechazada"] as QuoteStatus[]),
    subtotal, descuento, impuesto, total,
  };
});

// Dashboard stats
export const monthlyRevenue = [
  { mes: "Ene", ingresos: 12400 },{ mes: "Feb", ingresos: 15600 },{ mes: "Mar", ingresos: 18900 },
  { mes: "Abr", ingresos: 22100 },{ mes: "May", ingresos: 28400 },{ mes: "Jun", ingresos: 31200 },
  { mes: "Jul", ingresos: 26800 },{ mes: "Ago", ingresos: 24500 },{ mes: "Sep", ingresos: 29700 },
  { mes: "Oct", ingresos: 33400 },{ mes: "Nov", ingresos: 38900 },{ mes: "Dic", ingresos: 45200 },
];

export const conversionRate = [
  { mes: "Ene", tasa: 42 },{ mes: "Feb", tasa: 48 },{ mes: "Mar", tasa: 55 },
  { mes: "Abr", tasa: 51 },{ mes: "May", tasa: 62 },{ mes: "Jun", tasa: 68 },
  { mes: "Jul", tasa: 64 },{ mes: "Ago", tasa: 58 },{ mes: "Sep", tasa: 71 },
  { mes: "Oct", tasa: 75 },{ mes: "Nov", tasa: 78 },{ mes: "Dic", tasa: 82 },
];

export const eventsByCategory = EVENT_TYPES.map(tipo => ({
  tipo,
  cantidad: events.filter(e => e.tipo === tipo).length,
}));

export const topProducts = products.slice(0, 6).map((p, i) => ({
  nombre: p.nombre,
  alquileres: 120 - i * 14,
}));

export const topCustomers = [...customers]
  .sort((a, b) => b.totalGastado - a.totalGastado)
  .slice(0, 8);