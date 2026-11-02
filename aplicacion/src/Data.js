export const DATOS_TIENDA = {
  tasaManual: 38.50, 
  // Lee el número desde el archivo .env
  telefonoWhatsApp: import.meta.env.VITE_WHATSAPP_NUMBER 
};

// NUEVO SISTEMA DE PRECIOS PARA EXTRAS
export const PRECIOS_EXTRAS = {
  letra: 0.45,
  letraDorada: 0.80,
  pasador: 0.80,
  ojoTurco: 1.00,
  colgantePerrito: 0.80,
  colganteMuneco: 1.50,
  argollaPremium: 1.00 // Dorada o Plateada
};

export const PAGO_MOVIL_DATA = {
  // Lee los datos bancarios desde el archivo .env
  cedula: import.meta.env.VITE_PAGO_MOVIL_CEDULA,
  telefono: import.meta.env.VITE_PAGO_MOVIL_TELEFONO,
  banco: import.meta.env.VITE_PAGO_MOVIL_BANCO
};

export const CORD_COLORS = [
  // Lote Inicial / Base
  { id: 'arena', name: 'Arena', image: '/Cuerdas/Cuerda Arena.jpg', hexFallback: '#b8a48b', agotado: false },
  { id: 'marron', name: 'Marrón', image: '/Cuerdas/Cuerda Marron.jpg', hexFallback: '#5c4033', agotado: false },
  { id: 'gris', name: 'Gris', image: '/Cuerdas/Cuerda Gris.jpg', hexFallback: '#808080', agotado: false },
  { id: 'azul', name: 'Azul', image: '/Cuerdas/Cuerda Azul.jpg', hexFallback: '#0000cd', agotado: false },

  // Lote 1
  { id: 'vino', name: 'Vino', image: '/Cuerdas/Cuerda Vino.PNG', hexFallback: '#581825', agotado: false },
  { id: 'amarillo-mostaza', name: 'Amarillo Mostaza', image: '/Cuerdas/Cuerda Amarillo Mostaza.PNG', hexFallback: '#e59b00', agotado: false },
  { id: 'lila-pastel', name: 'Lila Pastel', image: '/Cuerdas/Cuerda Lila Pastel.PNG', hexFallback: '#b39ddb', agotado: false },
  { id: 'naranja-neon', name: 'Naranja Neón', image: '/Cuerdas/Cuerda Naranja Neon.PNG', hexFallback: '#ff4500', agotado: false },
  { id: 'turquesa-claro', name: 'Turquesa Claro', image: '/Cuerdas/Cuerda Turquesa Claro.PNG', hexFallback: '#00b4d8', agotado: false },
  { id: 'fucsia', name: 'Fucsia', image: '/Cuerdas/Cuerda Fucsia.PNG', hexFallback: '#e6007e', agotado: false },
  { id: 'verde-esmeralda', name: 'Verde Esmeralda', image: '/Cuerdas/Cuerda Verde Esmeralda.PNG', hexFallback: '#008080', agotado: false },
  { id: 'rojo-patron', name: 'Rojo Patrón', image: '/Cuerdas/Cuerda Rojo Patron.PNG', hexFallback: '#d90429', agotado: false },
  { id: 'morado-patron', name: 'Morado Patrón', image: '/Cuerdas/Cuerda Morado Patron.PNG', hexFallback: '#7b2cbf', agotado: false },
  { id: 'azul-cielo', name: 'Azul Cielo', image: '/Cuerdas/Cuerda Azul Cielo.PNG', hexFallback: '#7ec8e3', agotado: false },

  // Lote 2
  { id: 'turquesa-patron', name: 'Turquesa', image: '/Cuerdas/Cuerda Turquesa Patron.PNG', hexFallback: '#00b4d8', agotado: false },
  { id: 'borgona', name: 'Borgoña', image: '/Cuerdas/Cuerda Borgona.PNG', hexFallback: '#4a0e17', agotado: false },
  { id: 'verde-bosque', name: 'Verde Bosque', image: '/Cuerdas/Cuerda Verde Bosque.PNG', hexFallback: '#0b4f2c', agotado: false },
  { id: 'verde-menta', name: 'Verde Menta', image: '/Cuerdas/Cuerda Verde Menta.PNG', hexFallback: '#60d394', agotado: false },
  { id: 'vino-patron', name: 'Vino con blanco', image: '/Cuerdas/Cuerda Vino Patron.PNG', hexFallback: '#800020', agotado: false },
  { id: 'azul-rey-patron', name: 'Azul Rey con blanco', image: '/Cuerdas/Cuerda Azul Rey Patron.PNG', hexFallback: '#0038a8', agotado: false },
  { id: 'beige-patron', name: 'Beige/blanco', image: '/Cuerdas/Cuerda Beige Patron.PNG', hexFallback: '#c5a059', agotado: false },
  { id: 'morado-oscuro', name: 'Morado Oscuro', image: '/Cuerdas/Cuerda Morado Oscuro.PNG', hexFallback: '#4a0072', agotado: false },
  { id: 'amarillo-neon-patron', name: 'Amarillo Neón/Azul', image: '/Cuerdas/Cuerda Amarillo Neon Patron.PNG', hexFallback: '#ccff00', agotado: false },
  { id: 'azul-marino', name: 'Azul Marino', image: '/Cuerdas/Cuerda Azul Marino.PNG', hexFallback: '#001f3f', agotado: false },

  // Lote 3
  { id: 'blanco', name: 'Blanco', image: '/Cuerdas/Cuerda Blanco.PNG', hexFallback: '#ffffff', agotado: false },
  { id: 'amarillo-pastel', name: 'Amarillo Pastel', image: '/Cuerdas/Cuerda Amarillo Pastel.PNG', hexFallback: '#fff176', agotado: false },
  { id: 'verde-lima-pastel', name: 'Verde Lima Pastel', image: '/Cuerdas/Cuerda Verde Lima Pastel.PNG', hexFallback: '#a3e635', agotado: false },
  { id: 'azul-turquesa', name: 'Azul Turquesa', image: '/Cuerdas/Cuerda Azul Turquesa.PNG', hexFallback: '#38bdf8', agotado: false },
  { id: 'fucsia-patron', name: 'Fucsia/Blanco', image: '/Cuerdas/Cuerda Fucsia Patron.PNG', hexFallback: '#d946ef', agotado: false },
  { id: 'marron-chocolate', name: 'Marrón Chocolate', image: '/Cuerdas/Cuerda Marron Chocolate.PNG', hexFallback: '#5c3d2e', agotado: false },
  { id: 'terracota', name: 'Terracota', image: '/Cuerdas/Cuerda Terracota.PNG', hexFallback: '#9a3412', agotado: false },
  { id: 'beige-claro', name: 'Marrón Claro', image: '/Cuerdas/Cuerda Beige Claro.PNG', hexFallback: '#d4b996', agotado: false },
  { id: 'gris-plomo', name: 'Gris Plomo', image: '/Cuerdas/Cuerda Gris Plomo.PNG', hexFallback: '#4b5563', agotado: false },
  { id: 'verde-neon', name: 'Verde Neón', image: '/Cuerdas/Cuerda Verde Neon.PNG', hexFallback: '#22c55e', agotado: false },

  // Lote 4
  { id: 'rojo', name: 'Rojo', image: '/Cuerdas/Cuerda Rojo.PNG', hexFallback: '#dc2626', agotado: false },
  { id: 'arena-dorado', name: 'Arena Dorado', image: '/Cuerdas/Cuerda Arena Dorado.PNG', hexFallback: '#d4a373', agotado: false },
];

export const KNOT_TYPES = [
  { id: 'barril', name: 'Nudo barril', image: '/Nudos/Nudo barril.jpeg', desc: 'Clásico y resistente', agotado: false },
   { id: 'barril doble', name: 'Nudo barril doble', image: '/Nudos/nudo barril doble.jpeg', desc: 'Doble y resistente', agotado: false },
   { id: 'nudo doble simple', name: 'Nudo doble simple', image: '/Nudos/nudo sencillo.jpeg', desc: 'Sencillo y resistente', agotado: false },
   { id: 'nudo simple', name: 'Nudo simple', image: '/Nudos/nudo simple.jpeg', desc: 'Simple y resistente', agotado: false },

];

export const CLASP_TYPES = [
  { id: 'argollas', name: 'Argollas', image: '/Mosquetones/Sujertador 1.PNG', agotado: false },
  { id: 'chupon', name: 'Porta chupon', image: '/Mosquetones/Chupon.PNG', agotado: false },
  { id: 'argollas 2', name: 'Argollas 2', image: '/Mosquetones/Argollas.PNG', agotado: false },
  { id: 'click', name: 'Click', image: '/Mosquetones/Click.PNG', agotado: false },
  { id: 'mosqueton', name: 'Mosqueton', image: '/Mosquetones/Mosquetones.PNG', agotado: false },
  { id: 'langosta', name: 'Broche Langosta', image: '/Mosquetones/Langosta.PNG', agotado: false }
];

export const PASADORES = [
  // Publicados anteriormente
  { id: 'p1', name: 'Estrellitas', image: '/Pasantes/IMG_2901.PNG', agotado: false },
  { id: 'p2', name: 'Corazones', image: '/Pasantes/Corazones.PNG', agotado: false },
  { id: 'p3', name: 'Flor', image: '/Pasantes/Flor.PNG', agotado: false },
  { id: 'p4', name: 'Mariposa', image: '/Pasantes/Mariposa.PNG', agotado: false },

  // Nuevos 10 pasadores
  { id: 'p5', name: 'Flores Carita', image: '/Pasantes/IMG_2903.PNG', agotado: false },
  { id: 'p6', name: 'Corazones Carita', image: '/Pasantes/IMG_2905.PNG', agotado: false },
  { id: 'p7', name: 'Estrella Ojos', image: '/Pasantes/IMG_2907.PNG', agotado: false },
  { id: 'p8', name: 'Cubos Letras', image: '/Pasantes/IMG_2921.PNG', agotado: false },
  { id: 'p9', name: 'Coral', image: '/Pasantes/IMG_2925.PNG', agotado: false },
  { id: 'p10', name: 'Caracoles', image: '/Pasantes/IMG_2927.PNG', agotado: false },
  { id: 'p11', name: 'Cubos Corazón', image: '/Pasantes/IMG_2928.PNG', agotado: false },
  { id: 'p12', name: 'Cilindro Jaspeado', image: '/Pasantes/IMG_2929.PNG', agotado: false },
  { id: 'p13', name: 'Ovalado', image: '/Pasantes/IMG_2930.PNG', agotado: false },
  { id: 'p14', name: 'Corazones Lisos', image: '/Pasantes/IMG_2933.PNG', agotado: false },
  { id: 'p15', name: 'Ojo Turco', image: '/Pasantes/Ojos Turcos.PNG', agotado: false },


];

export const LETTER_STYLES = [
  // Modelos iniciales
  { id: 'azules', name: 'Azules', image: '/Letras/Letras Azules.jpeg', colorHex: '#0000cd', textColor: 'white', agotado: false },
  { id: 'verdes', name: 'Verdes', image: '/Letras/Letras Verdes.jpeg', colorHex: '#32cd32', textColor: 'white', agotado: false },
  { id: 'naranjas', name: 'Naranjas', image: '/Letras/Letras naranja.jpeg', colorHex: '#ff8c00', textColor: 'white', agotado: false },

  // Nuevos 9 modelos
  { id: 'moradas', name: 'Moradas', image: '/Letras/Letra Moradas.jpeg', colorHex: '#8a52d4', textColor: 'white', agotado: false },
  { id: 'amarillas', name: 'Amarillas', image: '/Letras/Letras Amarillas.jpeg', colorHex: '#facc15', textColor: 'black', agotado: false },
  { id: 'blancas', name: 'Blancas', image: '/Letras/Letras Blancas.jpeg', colorHex: '#f8fafc', textColor: 'black', agotado: false },
  { id: 'cyan', name: 'Cyan', image: '/Letras/Letras Cyan.jpeg', colorHex: '#0284c7', textColor: 'white', agotado: false },
  { id: 'fucsia', name: 'Fucsia', image: '/Letras/Letras fucsia.jpeg', colorHex: '#c026d3', textColor: 'white', agotado: false },
  { id: 'purpura', name: 'Púrpura', image: '/Letras/Letras Purpura.jpeg', colorHex: '#581c87', textColor: 'white', agotado: false },
  { id: 'rojas', name: 'Rojas', image: '/Letras/Letras rojas.jpeg', colorHex: '#dc2626', textColor: 'white', agotado: false },
  { id: 'rosa-pastel', name: 'Rosa Pastel', image: '/Letras/Letras rosa pastel .jpeg', colorHex: '#f472b6', textColor: 'white', agotado: false },
  { id: 'rosa', name: 'Rosa', image: '/Letras/Letras rosa.jpeg', colorHex: '#db2777', textColor: 'white', agotado: false },
];

export const COLGANTES = [
  // Iniciales (1 al 6)
  { id: 'c1', name: 'Abeja', image: '/Colgantes/abeja.PNG', agotado: false },
  { id: 'c2', name: 'Balones', image: '/Colgantes/balones.PNG', agotado: false },
  { id: 'c3', name: 'Capibara', image: '/Colgantes/capibara.PNG', agotado: false },
  { id: 'c4', name: 'Corazones', image: '/Colgantes/corazones cuero.PNG', agotado: false },
  { id: 'c5', name: 'Espejo', image: '/Colgantes/espejos.PNG', agotado: false },
  { id: 'c6', name: 'Hongo', image: '/Colgantes/hongo.PNG', agotado: false },

  // Lote 1 (7 al 15)
  { id: 'c7', name: 'Bob Esponja', image: '/Colgantes/BOB (1).jpg', agotado: false },
  { id: 'c8', name: 'Disney Navideño', image: '/Colgantes/DISNEY (1).jpg', agotado: false },
  { id: 'c9', name: 'Corazones Cuero Color', image: '/Colgantes/IMG_2912.jpg', agotado: false },
  { id: 'c10', name: 'Navideños Metálicos', image: '/Colgantes/IMG_2913.jpg', agotado: false },
  { id: 'c11', name: 'Pop Culture VZLA', image: '/Colgantes/IMG_2914.jpg', agotado: false },
  { id: 'c12', name: 'Pop Culture Menta', image: '/Colgantes/IMG_2915.jpg', agotado: false },
  { id: 'c13', name: 'Halloween', image: '/Colgantes/IMG_2916.jpg', agotado: false },
  { id: 'c14', name: 'Kuromi & Cinnamoroll', image: '/Colgantes/IMG_2934.jpg', agotado: false },
  { id: 'c15', name: 'Labubu', image: '/Colgantes/IMG_2936.jpg', agotado: false },

  // Lote 2 (16 al 24)
  { id: 'c16', name: 'Minecraft', image: '/Colgantes/IMG_2944.jpg', agotado: false },
  { id: 'c17', name: 'Hello Kitty', image: '/Colgantes/kitty.jpg', agotado: false },
  { id: 'c18', name: 'Mariquita', image: '/Colgantes/mariquita.jpg', agotado: false },
  { id: 'c19', name: 'Messi', image: '/Colgantes/messi.jpg', agotado: false },
  { id: 'c20', name: 'Monsters Inc', image: '/Colgantes/MONSTER INN.jpg', agotado: false },
  { id: 'c21', name: 'Ositos Gomita', image: '/Colgantes/ositos.jpg', agotado: false },
  { id: 'c22', name: 'Papitas Fritas', image: '/Colgantes/papitas.jpg', agotado: false },
  { id: 'c23', name: 'Peces', image: '/Colgantes/peces.jpg', agotado: false },
  { id: 'c24', name: 'Perro Globo', image: '/Colgantes/perro.jpg', agotado: false },

  // Lote 3 (25 al 28)
  { id: 'c25', name: 'Stitch', image: '/Colgantes/STISH (1).jpg', agotado: false },
  { id: 'c26', name: 'Termo Bebida', image: '/Colgantes/termo.jpg', agotado: false },
  { id: 'c27', name: 'Tom y Jerry', image: '/Colgantes/tom.jpg', agotado: false },
  { id: 'c28', name: 'Baby Yoda', image: '/Colgantes/YODA (1).png', agotado: false },

  // Opción por defecto
  { id: 'none', name: 'Sin Colgante', image: null, isNone: true, agotado: false }
];

export const CATALOGO_FAVORITOS = [
  { 
    id: 'cat1', 
    name: 'Llavero Simple', 
    image: '/Catalogo/Llavero 1 cuerda.jpeg', 
    badge: 'Más Vendido', 
    badgeColor: 'bg-pink-100 text-pink-600', 
    bgColor: 'bg-pink-50',
    basePrice: 10,
    inclusions: { letras: 5, pasadores: 1, colgantes: 1, type: 'normal' }
  },
  { 
    id: 'cat2', 
    name: 'Llavero Arcoíris', 
    image: '/Catalogo/Llavero doble cuerda.jpeg', 
    badge: null, 
    badgeColor: '',
    bgColor: 'bg-blue-50',
    basePrice: 12,
    inclusions: { letras: 6, pasadores: 2, colgantes: 1, type: 'normal' }
  },
  { 
    id: 'cat3', 
    name: 'Llavero BTS', 
    image: '/Catalogo/Llavero Bts.jpeg', 
    badge: 'Edición Limitada', 
    badgeColor: 'bg-yellow-100 text-yellow-700', 
    bgColor: 'bg-orange-50',
    basePrice: 14,
    inclusions: { letras: 10, pasadores: 1, colgantes: 0, type: 'normal' } 
  },
  { 
    id: 'cat4', 
    name: 'Llavero cuatro cuerdas', 
    image: '/Catalogo/Llavero 4 cuerdas.jpeg', 
    badge: null, 
    badgeColor: '', 
    bgColor: 'bg-pink-50',
    basePrice: 10,
    inclusions: { letras: 6, pasadores: 2, colgantes: 0, type: 'normal' }
  },
  { 
    id: 'cat5', 
    name: 'Llavero con cadena', 
    image: '/Catalogo/llavero cadena.jpeg', 
    badge: null, 
    badgeColor: '', 
    bgColor: 'bg-pink-50',
    basePrice: 14,
    inclusions: { letras: 6, pasadores: 0, colgantes: 3, type: 'normal' }
  },
  { 
    id: 'cat6', 
    name: 'Llavero doble sencillo', 
    image: '/Catalogo/Llavero doble sencillo.jpeg', 
    badge: null, 
    badgeColor: '', 
    bgColor: 'bg-pink-50',
    basePrice: 9,
    inclusions: { letras: 6, pasadores: 0, colgantes: 1, type: 'normal' }
  },
  { 
    id: 'cat7', 
    name: 'Llavero Love', 
    image: '/Catalogo/Llavero Love.jpeg', 
    badge: null, 
    badgeColor: '', 
    bgColor: 'bg-pink-50',
    basePrice: 11,
    inclusions: { letras: 5, pasadores: 1, colgantes: 1, type: 'normal' }
  },
  { 
    id: 'cat8', 
    name: 'Para tu Celular', 
    image: '/Catalogo/Celular.jpeg', 
    badge: null, 
    badgeColor: '', 
    bgColor: 'bg-pink-50',
    basePrice: 12,
    inclusions: { letras: 6, pasadores: 2, colgantes: 0, type: 'strap' }
  },
  { 
    id: 'cat9', 
    name: 'Llavero Perrito', 
    image: '/Catalogo/Llavero Perrito.jpeg', 
    badge: null, 
    badgeColor: '', 
    bgColor: 'bg-pink-50',
    basePrice: 11,
    inclusions: { letras: 8, pasadores: 0, colgantes: 1, type: 'normal' }
  },
  { 
    id: 'cat10', 
    name: 'Collar Mascota', 
    image: '/Catalogo/Collar.jpeg', 
    badge: null, 
    badgeColor: '', 
    bgColor: 'bg-pink-50',
    basePrice: 12,
    inclusions: { letras: 0, pasadores: 0, colgantes: 0, type: 'mascota' }
  },
  { 
    id: 'cat11-peq', 
    name: 'Chick (Pequeño - 6cm)', 
    image: '/Catalogo/Modelo 1.jpeg', 
    badge: null, 
    badgeColor: '', 
    bgColor: 'bg-pink-50',
    basePrice: 6,
    inclusions: { letras: 2, pasadores: 0, colgantes: 1, type: 'normal' }
  },
  { 
    id: 'cat11-gde', 
    name: 'Chick (Grande - 12cm)', 
    image: '/Catalogo/Modelo 1.jpeg', 
    badge: null, 
    badgeColor: '', 
    bgColor: 'bg-pink-50',
    basePrice: 8,
    inclusions: { letras: 2, pasadores: 0, colgantes: 1, type: 'normal' }
  },
  { 
    id: 'cat12', 
    name: 'Doble Nudo con Cadena', 
    image: '/Catalogo/Llavero doble nudo.jpeg', 
    badge: null, 
    badgeColor: '', 
    bgColor: 'bg-pink-50',
    basePrice: 13,
    inclusions: { letras: 5, pasadores: 3, colgantes: 3, type: 'dorado' }
  },
  { 
    id: 'cat13', 
    name: 'Strap Largo', 
    image: '/Catalogo/Strap largo  .jpg', 
    badge: null, 
    badgeColor: '', 
    bgColor: 'bg-pink-50',
    basePrice: 11,
    inclusions: { letras: 0, pasadores: 0, colgantes: 0, type: 'strap-premium' }
  },
  { 
    id: 'cat14', 
    name: 'Strap mano', 
    image: '/Catalogo/Strap de Mano para telefono.jpeg', 
    badge: null, 
    badgeColor: '', 
    bgColor: 'bg-pink-50',
    basePrice: 8,
    inclusions: { letras: 0, pasadores: 0, colgantes: 0, type: 'strap-premium' }
  }
];

