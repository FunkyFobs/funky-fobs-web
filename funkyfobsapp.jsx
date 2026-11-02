import React, { useState, useEffect } from 'react';
import { 
  Check, ChevronRight, Sparkles, Type, Link as LinkIcon, 
  Palette, MapPin, Instagram, MessageCircle, Wand2, 
  Star, ArrowRight, Copy, CheckCircle, Package, CreditCard 
} from 'lucide-react';

// ==========================================
// 🛠️ DATOS CONFIGURABLES
// ==========================================
const DATOS_TIENDA = {
  tasaManual: 38.50, // 💵 Esta se usará solo si falla la consulta automática al BCV
  telefonoWhatsApp: "584244595645" // Sin el '+'
};

const PRICING = {
  base: 5.00,
  perLetter: 0.50,
  perPasador: 0.50,
  perColgante: 1.00
};

const PAGO_MOVIL_DATA = {
  cedula: "21469596",
  telefono: "04265185692",
  banco: "Mercantil (0105)"
};

const CORD_COLORS = [
  { id: 'arena', name: 'Arena', image: 'Cuerda Arena.jpg', hexFallback: '#b8a48b' },
  { id: 'marron', name: 'Marrón', image: 'Cuerda Marron.jpg', hexFallback: '#5c4033' },
  { id: 'gris', name: 'Gris', image: 'Cuerda Gris.jpg', hexFallback: '#808080' },
  { id: 'azul', name: 'Azul', image: 'Cuerda Azul.jpg', hexFallback: '#0000cd' },
];

const KNOT_TYPES = [
  { id: 'tambor', name: 'Nudo Tambor', image: 'Nudo tambor.jpeg', desc: 'Clásico y resistente' },
];

const CLASP_TYPES = [
  { id: 'argollas', name: 'Argollas', image: 'Sujertador 1.jpg' },
  { id: 'pinzas', name: 'Pinzas', image: 'Mosqueton.jpg' },
];

const PASADORES = [
  { id: 'p1', name: 'Estrellita Morada', image: 'IMG_2901.jpg' },
  { id: 'p2', name: 'Estrellita Azul', image: 'IMG_2901.jpg' },
  { id: 'p3', name: 'Estrellita Rosa', image: 'IMG_2901.jpg' },
  { id: 'p4', name: 'Estrellita Amarilla', image: 'IMG_2901.jpg' },
  { id: 'none', name: 'Sin Pasador', image: null, isNone: true }
];

const LETTER_STYLES = [
  { id: 'azules', name: 'Azules', image: 'Letras Azules.jpeg', colorHex: '#0000cd', textColor: 'white' },
  { id: 'verdes', name: 'Verdes', image: 'Letras Verdes.jpeg', colorHex: '#32cd32', textColor: 'white' },
  { id: 'naranjas', name: 'Naranjas', image: 'Letras naranja.jpeg', colorHex: '#ff8c00', textColor: 'white' },
];

const COLGANTES = [
  { id: 'c1', name: 'Estrellita', emoji: '⭐' },
  { id: 'c2', name: 'Corazoncito', emoji: '💖' },
  { id: 'c3', name: 'Ojito', emoji: '🧿' },
  { id: 'c4', name: 'Mariposa', emoji: '🦋' },
  { id: 'c5', name: 'Osito', emoji: '🧸' },
  { id: 'c6', name: 'Flor', emoji: '🌸' },
];

const CATALOGO_FAVORITOS = [
  { 
    id: 'cat1', 
    name: 'Llavero Tonos Pastel', 
    image: '', 
    badge: 'Más Vendido', 
    badgeColor: 'bg-pink-100 text-pink-600', 
    bgColor: 'bg-pink-50' 
  },
  { 
    id: 'cat2', 
    name: 'Llavero Arcoíris', 
    image: '', 
    badge: null, 
    badgeColor: '',
    bgColor: 'bg-blue-50' 
  },
  { 
    id: 'cat3', 
    name: 'Llavero Halloween', 
    image: '', 
    badge: 'Edición Limitada', 
    badgeColor: 'bg-yellow-100 text-yellow-700', 
    bgColor: 'bg-orange-50' 
  },
];

export default function FunkyFobsApp() {
  const [exchangeRate, setExchangeRate] = useState(DATOS_TIENDA.tasaManual);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'builder', 'checkout'
  const [currentStep, setCurrentStep] = useState(1);
  
  // Builder State
  const [selections, setSelections] = useState({
    cord: null,
    knot: null,
    clasp: null,
    pasador: null,
    letterStyle: null,
    text: '',
    colgantes: []
  });

  // Checkout State
  const [checkoutData, setCheckoutData] = useState({
    shippingMethod: 'MRW',
    shippingAddress: '',
    shippingId: '',
    customerName: '',
    customerPhone: '',
    extraNotes: '',
    paymentReference: ''
  });
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    const fetchBCV = async () => {
      try {
        const response = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');
        const data = await response.json();
        if (data && data.promedio) {
          setExchangeRate(data.promedio);
        }
      } catch (error) {
        console.error("Error cargando API BCV, usando tasa manual.", error);
      }
    };
    fetchBCV();
  }, []);

  const updateSelection = (key, value) => {
    setSelections(prev => ({ ...prev, [key]: value }));
  };

  const toggleColgante = (colgante) => {
    setSelections(prev => {
      const exists = prev.colgantes.find(c => c.id === colgante.id);
      if (exists) {
        return { ...prev, colgantes: prev.colgantes.filter(c => c.id !== colgante.id) };
      }
      return { ...prev, colgantes: [...prev.colgantes, colgante] };
    });
  };

  const calculateTotal = () => {
    const lettersCost = selections.text.length * PRICING.perLetter;
    const pasadorCost = selections.pasador && !selections.pasador.isNone ? PRICING.perPasador : 0;
    const colgantesCost = selections.colgantes.length * PRICING.perColgante;
    return PRICING.base + lettersCost + pasadorCost + colgantesCost;
  };

  const totalPrice = calculateTotal();
  const totalBs = (totalPrice * exchangeRate).toFixed(2);

  const isComplete = Boolean(
    selections.cord && 
    selections.knot && 
    selections.clasp && 
    selections.pasador &&
    selections.letterStyle && 
    selections.text.trim().length > 0
  );

  const isCheckoutComplete = Boolean(
    checkoutData.shippingAddress &&
    checkoutData.shippingId &&
    checkoutData.customerName &&
    checkoutData.customerPhone &&
    checkoutData.paymentReference
  );

  const startBuilding = () => {
    setCurrentView('builder');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToCheckout = () => {
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const generateWhatsAppLink = () => {
    if (!isCheckoutComplete) return "#";
    
    const colgantesText = selections.colgantes.length > 0 
      ? `\n✨ *Colgantes:* ${selections.colgantes.map(c => c.name).join(', ')}` 
      : '';
      
    const pasadorText = selections.pasador && !selections.pasador.isNone 
      ? `\n⭐ *Pasador:* ${selections.pasador.name}` 
      : '';

    const message = `¡Hola FunkyFobs! 💖 Aquí está mi pedido y comprobante de pago:\n\n` +
      `*1. DISEÑO DEL LLAVERO*\n` +
      `🏷️ Nombre: ${selections.text}\n` +
      `🎨 Letras: ${selections.letterStyle.name}\n` +
      `🧶 Cuerda: ${selections.cord.name}\n` +
      `🪢 Nudo: ${selections.knot.name}\n` +
      `🔗 Sujetador: ${selections.clasp.name}` +
      pasadorText +
      colgantesText + `\n\n` +
      `*2. DATOS DE ENVÍO*\n` +
      `📦 Empresa: ${checkoutData.shippingMethod}\n` +
      `📍 Dirección: ${checkoutData.shippingAddress}\n` +
      `👤 Recibe: ${checkoutData.customerName} (C.I: ${checkoutData.shippingId})\n` +
      `📱 Teléfono: ${checkoutData.customerPhone}\n` +
      (checkoutData.extraNotes ? `📝 Notas: ${checkoutData.extraNotes}\n` : '') + `\n` +
      `*3. PAGO*\n` +
      `💳 Referencia: ${checkoutData.paymentReference}\n` +
      `💰 Total: $${totalPrice.toFixed(2)} (Bs. ${totalBs})`;

    return `https://wa.me/${DATOS_TIENDA.telefonoWhatsApp}?text=${encodeURIComponent(message)}`;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-500" /> Color de Cuerda
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CORD_COLORS.map(cord => (
                <button
                  key={cord.id}
                  onClick={() => updateSelection('cord', cord)}
                  className={`flex flex-col items-center gap-2 p-2 rounded-xl border-2 transition-all ${
                    selections.cord?.id === cord.id ? 'border-[#a052e6] bg-purple-50 shadow-sm' : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div className="w-full aspect-square rounded-lg shadow-sm overflow-hidden bg-gray-100">
                    {cord.image ? <img src={cord.image} alt={cord.name} className="w-full h-full object-cover" /> : <div className="w-full h-full" style={{backgroundColor: cord.hexFallback}}/>}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{cord.name}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-purple-500" /> Tipo de Nudo
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {KNOT_TYPES.map(knot => (
                <button
                  key={knot.id}
                  onClick={() => updateSelection('knot', knot)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                    selections.knot?.id === knot.id ? 'border-[#ff6b9d] bg-pink-50' : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div className="w-16 h-16 rounded bg-gray-200 overflow-hidden shrink-0">
                    {knot.image && <img src={knot.image} alt={knot.name} className="w-full h-full object-cover" />}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">{knot.name}</div>
                    <div className="text-xs text-gray-500">{knot.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Check className="w-5 h-5 text-purple-500" /> Sujetador / Mosquetón
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {CLASP_TYPES.map(clasp => (
                <button
                  key={clasp.id}
                  onClick={() => updateSelection('clasp', clasp)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    selections.clasp?.id === clasp.id ? 'border-[#a052e6] bg-purple-50' : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div className="h-24 w-full bg-white rounded-lg flex items-center justify-center p-2 mix-blend-multiply">
                     {clasp.image && <img src={clasp.image} alt={clasp.name} className="w-full h-full object-contain" />}
                  </div>
                  <span className="font-bold text-sm text-gray-700">{clasp.name}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Star className="w-5 h-5 text-purple-500" /> Pasadores
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {PASADORES.map(pasador => (
                <button
                  key={pasador.id}
                  onClick={() => updateSelection('pasador', pasador)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    selections.pasador?.id === pasador.id ? 'border-[#a052e6] bg-purple-50' : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div className="h-24 w-full bg-white rounded-lg flex items-center justify-center p-2 mix-blend-multiply overflow-hidden">
                     {pasador.image ? (
                        <img src={pasador.image} alt={pasador.name} className="w-full h-full object-contain" />
                     ) : (
                        <span className="text-gray-400 font-medium text-sm">Ninguno</span>
                     )}
                  </div>
                  <span className="font-bold text-sm text-gray-700">{pasador.name}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6 animate-in fade-in">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Type className="w-5 h-5 text-purple-500" /> Estilo de Letras y Nombre
            </h3>
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-600 block">1. Color de letras:</label>
              <div className="grid grid-cols-3 gap-3">
                {LETTER_STYLES.map(style => (
                  <button
                    key={style.id}
                    onClick={() => updateSelection('letterStyle', style)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                      selections.letterStyle?.id === style.id ? 'border-[#ff6b9d] bg-pink-50' : 'border-gray-100 hover:border-gray-300'
                    }`}
                  >
                     <div className="w-full h-12 rounded bg-gray-200 overflow-hidden">
                       {style.image && <img src={style.image} alt={style.name} className="w-full h-full object-cover" />}
                     </div>
                    <span className="text-xs font-bold text-gray-700">{style.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 block flex justify-between">
                <span>2. Escribe el nombre:</span>
                <span className="text-purple-600">+${PRICING.perLetter.toFixed(2)} c/u</span>
              </label>
              <input
                type="text"
                maxLength={12}
                value={selections.text}
                onChange={(e) => updateSelection('text', e.target.value.toUpperCase())}
                placeholder="Ej. SOFIA"
                className="w-full text-2xl p-4 rounded-xl border-2 border-gray-200 focus:border-[#a052e6] outline-none uppercase text-center font-black tracking-widest bg-gray-50 focus:bg-white transition-colors"
              />
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4 animate-in fade-in">
             <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" /> Colgantes Extras
              </h3>
              <span className="text-sm font-bold text-purple-600">+${PRICING.perColgante.toFixed(2)} c/u</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {COLGANTES.map(colgante => {
                const isSelected = selections.colgantes.some(c => c.id === colgante.id);
                return (
                  <button
                    key={colgante.id}
                    onClick={() => toggleColgante(colgante)}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                      isSelected ? 'border-[#a052e6] bg-purple-50 scale-105' : 'border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-3xl">{colgante.emoji}</span>
                    <span className="text-xs font-medium text-gray-600 text-center">{colgante.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 selection:bg-pink-200 selection:text-pink-900 overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <button onClick={() => setCurrentView('home')} className="hover:scale-105 transition-transform flex items-center">
            <img 
              src="Logo.jpeg" 
              alt="Logo Funky Fobs" 
              className="h-14 w-14 sm:h-16 sm:w-16 rounded-full object-cover shadow-md border-2 border-white"
            />
          </button>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-600">
            <button onClick={() => setCurrentView('home')} className="hover:text-[#a052e6] transition-colors">Inicio</button>
            <button onClick={() => { setCurrentView('home'); setTimeout(() => document.getElementById('catalogo')?.scrollIntoView({behavior:'smooth'}), 100); }} className="hover:text-[#a052e6] transition-colors">Catálogo</button>
            <a href={`https://wa.me/${DATOS_TIENDA.telefonoWhatsApp}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#a052e6] transition-colors">Contacto</a>
          </div>
          <button 
            onClick={startBuilding}
            className="bg-gradient-to-r from-[#a052e6] to-[#ff6b9d] text-white px-5 py-2.5 rounded-full font-bold shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-105 transition-all flex items-center gap-2"
          >
            <span className="hidden sm:inline">Armar Llavero</span> <Wand2 className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-grow flex flex-col w-full">
        
        {/* VIEW 1: HOME */}
        {currentView === 'home' && (
          <div className="w-full animate-in fade-in duration-500">
            <section className="relative w-full bg-[#fcfbf9] overflow-hidden min-h-[90vh] md:min-h-[80vh] flex items-center">
              <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-purple-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-60 pointer-events-none"></div>
              <div className="absolute bottom-[-10%] right-[-5%] w-[35rem] h-[35rem] bg-pink-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-60 pointer-events-none"></div>
              <div className="absolute top-[20%] right-[10%] w-[25rem] h-[25rem] bg-yellow-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60 pointer-events-none"></div>

              <div className="max-w-6xl mx-auto px-4 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10 py-12">
                <div className="space-y-6 max-w-xl">
                  <div className="inline-flex items-center gap-1 bg-purple-50 text-purple-600 border border-purple-100 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                    ✨ ¡Llaveros 100% Personalizados!
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
                    Lleva tu nombre<br/>con <span style={{ color: '#d84e9d' }}>mucho estilo</span>
                  </h1>
                  <p className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed">
                    Diseñamos llaveros 'chunky' súper divertidos, coloridos y únicos. Perfectos para tus llaves, bolsos, mochilas o para regalar a esa persona especial.
                  </p>
                  <div className="flex flex-wrap items-center gap-4 pt-4">
                    <button 
                      onClick={() => document.getElementById('catalogo')?.scrollIntoView({behavior: 'smooth'})}
                      className="bg-[#a052e6] hover:bg-purple-700 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-purple-500/30 transition-all hover:scale-105"
                    >
                      Ver Diseños
                    </button>
                    <a 
                      href={`https://wa.me/${DATOS_TIENDA.telefonoWhatsApp}`}
                      target="_blank" rel="noopener noreferrer"
                      className="bg-white text-gray-800 border-2 border-gray-200 hover:border-gray-300 px-8 py-4 rounded-full font-bold shadow-sm transition-all flex items-center gap-2"
                    >
                      Contáctanos
                    </a>
                  </div>
                </div>

                <div className="relative flex justify-center items-center h-[400px] md:h-[500px]">
                  <div className="w-[85%] h-[85%] bg-pink-100 rounded-[2rem] shadow-2xl shadow-pink-900/10 rotate-3 border-4 border-white relative overflow-hidden flex flex-col justify-between p-6">
                    <div className="text-pink-400 font-bold tracking-tight bg-white/50 w-fit px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                      Diseño Exclusivo
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                       <span className="text-6xl text-pink-300 font-black rotate-[-10deg]">FunkyFobs</span>
                    </div>
                  </div>
                  <div className="absolute bottom-6 right-0 md:-right-6 rotate-[-5deg] bg-white border-4 border-yellow-200 p-4 rounded-2xl shadow-xl z-20 animate-bounce">
                    <p className="font-black text-gray-800 text-lg">¡Hazlo a tu medida!</p>
                    <p className="text-sm font-bold text-gray-500 flex items-center gap-1 mt-1">
                      ❤️ +100 mostacillas
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="catalogo" className="w-full bg-white py-24">
              <div className="max-w-6xl mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Nuestros Favoritos</h2>
                  <p className="text-lg text-gray-600 font-medium">
                    Explora algunos de nuestros diseños más populares y úsalos como inspiración para crear el tuyo.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {CATALOGO_FAVORITOS.map((item) => (
                    <div key={item.id} className="group flex flex-col">
                      <div className={`relative aspect-[4/5] ${item.bgColor} rounded-3xl overflow-hidden mb-4 border-8 border-gray-50 transition-transform group-hover:scale-[1.02] duration-300`}>
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                             <ImageIcon className="w-16 h-16 opacity-20" />
                          </div>
                        )}
                        {item.badge && (
                          <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${item.badgeColor}`}>
                            {item.badge}
                          </div>
                        )}
                      </div>
                      <div className="px-2">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">{item.name}</h3>
                        <button 
                          onClick={startBuilding}
                          className="w-full py-3.5 bg-gray-100 hover:bg-[#a052e6] hover:text-white text-gray-800 font-bold rounded-xl transition-colors flex justify-center items-center gap-2"
                        >
                          Crear este diseño <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: BUILDER */}
        {currentView === 'builder' && (
          <div className="w-full py-12 max-w-6xl mx-auto px-4 animate-in slide-in-from-bottom-8 duration-500">
             <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-black text-gray-900">Arma tu Llavero 🪄</h2>
                <p className="text-gray-500 mt-2 font-medium">Sigue los pasos y personaliza cada detalle.</p>
             </div>
             <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                {/* LEFT: Steps Area */}
                <div className="w-full lg:w-3/5 bg-white rounded-3xl shadow-xl shadow-purple-900/5 border border-purple-100/50 overflow-hidden flex flex-col">
                  <div className="flex bg-gray-50 p-2 overflow-x-auto hide-scrollbar border-b border-gray-100">
                    {[
                      { step: 1, label: 'Cuerda' },
                      { step: 2, label: 'Nudo' },
                      { step: 3, label: 'Mosquetón' },
                      { step: 4, label: 'Pasador' },
                      { step: 5, label: 'Nombre' },
                      { step: 6, label: 'Colgantes' }
                    ].map((s) => (
                      <button
                        key={s.step}
                        onClick={() => setCurrentStep(s.step)}
                        className={`flex-1 min-w-[80px] py-3 px-1 text-xs sm:text-sm font-bold rounded-xl transition-all flex flex-col items-center gap-1 ${
                          currentStep === s.step 
                            ? 'bg-white text-[#a052e6] shadow-sm ring-1 ring-purple-100' 
                            : currentStep > s.step 
                              ? 'text-gray-600 hover:bg-purple-50' 
                              : 'text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          currentStep === s.step ? 'bg-[#a052e6] text-white' : currentStep > s.step ? 'bg-gray-800 text-white' : 'bg-gray-200'
                        }`}>
                          {currentStep > s.step ? <Check className="w-4 h-4" /> : s.step}
                        </span>
                        <span className="hidden sm:block truncate w-full text-center">{s.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="p-6 md:p-8 flex-grow bg-white min-h-[400px]">
                    {renderStepContent()}
                  </div>

                  <div className="p-4 md:p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <button
                      onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                      disabled={currentStep === 1}
                      className="px-4 py-2 font-bold text-gray-400 disabled:opacity-0 hover:text-gray-700 transition-colors"
                    >
                      Volver
                    </button>
                    {currentStep < 6 ? (
                      <button
                        onClick={() => setCurrentStep(prev => Math.min(6, prev + 1))}
                        className="px-8 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-full shadow-md transition-all flex items-center gap-2"
                      >
                        Siguiente <ChevronRight className="w-5 h-5" />
                      </button>
                    ) : (
                      <div className="text-sm font-bold text-purple-600 flex items-center gap-1">
                        ¡Listo! Revisa tu resumen 👉
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT: Summary Area */}
                <div className="w-full lg:w-2/5 bg-white rounded-3xl shadow-xl shadow-pink-900/5 border border-pink-100/50 p-6 md:p-8 lg:sticky top-28">
                  <h3 className="text-xl font-black text-gray-900 mb-4 border-b border-gray-100 pb-4">Resumen de tu pedido</h3>
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-sm font-medium text-gray-600 items-center">
                      <span>Llavero Base</span>
                      <span className="text-gray-900 font-bold">${PRICING.base.toFixed(2)}</span>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-xs border border-gray-100">
                      <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                        <span className="text-gray-500 uppercase font-bold tracking-wider">Detalles Básicos</span>
                        <span className="text-green-600 font-bold">Incluido</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-gray-700 font-medium">
                        <div><span className="text-gray-400">Cuerda:</span> {selections.cord?.name || '-'}</div>
                        <div><span className="text-gray-400">Nudo:</span> {selections.knot?.name || '-'}</div>
                        <div><span className="text-gray-400">Broche:</span> {selections.clasp?.name || '-'}</div>
                        <div><span className="text-gray-400">Letras:</span> {selections.letterStyle?.name || '-'}</div>
                      </div>
                    </div>

                    {(selections.text.length > 0 || selections.colgantes.length > 0 || (selections.pasador && !selections.pasador.isNone)) && (
                      <div className="space-y-2 pt-2">
                        {selections.text.length > 0 && (
                          <div className="flex justify-between text-sm text-gray-600 items-center">
                            <span>Letras ({selections.text.length} x ${PRICING.perLetter.toFixed(2)})</span>
                            <span className="text-gray-900 font-bold">+${(selections.text.length * PRICING.perLetter).toFixed(2)}</span>
                          </div>
                        )}
                        {selections.pasador && !selections.pasador.isNone && (
                          <div className="flex justify-between text-sm text-gray-600 items-center">
                            <span>Pasador ({selections.pasador.name})</span>
                            <span className="text-gray-900 font-bold">+${PRICING.perPasador.toFixed(2)}</span>
                          </div>
                        )}
                        {selections.colgantes.length > 0 && (
                          <div className="flex justify-between text-sm text-gray-600 items-start">
                            <span className="flex flex-col">
                              <span>Colgantes Extras ({selections.colgantes.length} x ${PRICING.perColgante.toFixed(2)})</span>
                              <span className="text-xs text-purple-500 font-medium mt-0.5">{selections.colgantes.map(c=>c.emoji).join(' ')}</span>
                            </span>
                            <span className="text-gray-900 font-bold">+${(selections.colgantes.length * PRICING.perColgante).toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t-2 border-dashed border-gray-200 flex justify-between items-end mb-8">
                    <span className="text-gray-500 font-bold uppercase tracking-wider text-sm">Total Estimado</span>
                    <span className="text-4xl font-black text-[#ff6b9d]">${totalPrice.toFixed(2)}</span>
                  </div>

                  {!isComplete && (
                    <div className="bg-yellow-50 text-yellow-800 text-xs font-medium p-3 rounded-xl mb-4 border border-yellow-200 text-center">
                      Completa todos los pasos obligatorios (1 al 5) para poder hacer tu pedido.
                    </div>
                  )}

                  <button 
                    onClick={goToCheckout}
                    disabled={!isComplete}
                    className={`w-full py-4 font-black text-lg rounded-full shadow-lg transition-all flex items-center justify-center gap-2 ${
                      isComplete 
                        ? 'bg-[#a052e6] hover:bg-[#8b43cc] text-white hover:shadow-purple-500/30 hover:scale-[1.02]' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-70'
                    }`}
                  >
                    Ir al Pago y Envío <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
             </div>
          </div>
        )}

        {/* VIEW 3: CHECKOUT */}
        {currentView === 'checkout' && (
          <div className="w-full py-12 max-w-2xl mx-auto px-4 animate-in slide-in-from-right-8 duration-500">
            <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6 md:p-10">
                <div className="flex items-center gap-3 mb-2 text-[#ff6b9d] font-bold">
                  <Package className="w-6 h-6" />
                  <h2>Envío y pago</h2>
                </div>
                <p className="text-gray-500 mb-8 text-sm md:text-base">
                  Completa tus datos de envío, paga por Pago Móvil y envíanos el comprobante.
                </p>

                {/* 1. DATOS DE ENVÍO */}
                <section className="mb-10">
                  <h3 className="text-lg font-black text-gray-900 mb-4">1. Datos de envío</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Empresa de Envío:</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['MRW', 'ZOOM'].map(method => (
                          <button
                            key={method}
                            onClick={() => setCheckoutData({...checkoutData, shippingMethod: method})}
                            className={`py-3 rounded-xl font-black transition-all border-2 ${
                              checkoutData.shippingMethod === method 
                                ? 'border-[#ff6b9d] text-[#ff6b9d] bg-white' 
                                : 'border-[#f5ece1] bg-[#fffbf6] text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Dirección de {checkoutData.shippingMethod}:</label>
                      <textarea 
                        rows="3"
                        value={checkoutData.shippingAddress}
                        onChange={(e) => setCheckoutData({...checkoutData, shippingAddress: e.target.value})}
                        placeholder="Calle, urbanización, punto de referencia..."
                        className="w-full p-4 rounded-xl border-2 border-[#f5ece1] bg-[#fffbf6] focus:border-[#ff6b9d] focus:bg-white outline-none resize-none transition-colors"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Cédula de quien recibe:</label>
                      <input 
                        type="text"
                        value={checkoutData.shippingId}
                        onChange={(e) => setCheckoutData({...checkoutData, shippingId: e.target.value})}
                        placeholder="Ej: 12345678"
                        className="w-full p-4 rounded-xl border-2 border-[#f5ece1] bg-[#fffbf6] focus:border-[#ff6b9d] focus:bg-white outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Nombre y Apellido:</label>
                      <input 
                        type="text"
                        value={checkoutData.customerName}
                        onChange={(e) => setCheckoutData({...checkoutData, customerName: e.target.value})}
                        placeholder="Ej: Darleth Pérez"
                        className="w-full p-4 rounded-xl border-2 border-[#f5ece1] bg-[#fffbf6] focus:border-[#ff6b9d] focus:bg-white outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Teléfono (WhatsApp):</label>
                      <input 
                        type="text"
                        value={checkoutData.customerPhone}
                        onChange={(e) => setCheckoutData({...checkoutData, customerPhone: e.target.value})}
                        placeholder="Ej: 04125687456"
                        className="w-full p-4 rounded-xl border-2 border-[#f5ece1] bg-[#fffbf6] focus:border-[#ff6b9d] focus:bg-white outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Detalles adicionales <span className="text-xs font-normal text-gray-400 ml-1 bg-gray-100 px-2 py-0.5 rounded-full">OPCIONAL</span></label>
                      <textarea 
                        rows="2"
                        value={checkoutData.extraNotes}
                        onChange={(e) => setCheckoutData({...checkoutData, extraNotes: e.target.value})}
                        placeholder="Agrega alguna instrucción especial que necesites..."
                        className="w-full p-4 rounded-xl border-2 border-[#f5ece1] bg-[#fffbf6] focus:border-[#ff6b9d] focus:bg-white outline-none resize-none transition-colors"
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-[#fffaf5] border border-[#f5ece1] rounded-2xl p-5 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-100"><CreditCard className="w-4 h-4 text-[#a052e6]"/></div>
                      <div>
                        <p className="font-bold text-sm text-gray-800">Pagas por Pago Móvil</p>
                        <p className="text-xs text-gray-500 mt-0.5">Te mostramos los datos en el siguiente paso.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-100"><Package className="w-4 h-4 text-orange-500"/></div>
                      <div>
                        <p className="font-bold text-sm text-gray-800">Envío por MRW o ZOOM</p>
                        <p className="text-xs text-gray-500 mt-0.5">Enviamos a nivel nacional (Cobro a destino).</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 2. PAGO MÓVIL */}
                <section className="mb-10">
                  <h3 className="text-lg font-black text-gray-900 mb-1">2. Paga por Pago Móvil</h3>
                  <p className="text-xs text-green-600 font-bold mb-4 bg-green-50 w-fit px-2 py-1 rounded border border-green-200">
                    Tasa BCV del día aplicada: Bs. {exchangeRate}
                  </p>
                  <div className="bg-[#fffdf9] border-2 border-[#fcf0e1] rounded-2xl p-5">
                    {[
                      { label: 'Cédula', value: PAGO_MOVIL_DATA.cedula, id: 'cedula' },
                      { label: 'Teléfono', value: PAGO_MOVIL_DATA.telefono, id: 'telefono' },
                      { label: 'Banco', value: PAGO_MOVIL_DATA.banco, id: 'banco' },
                      { label: 'Monto', value: `Bs. ${totalBs}`, id: 'monto' },
                      { label: 'Concepto', value: 'Pago llavero', id: 'concepto' },
                    ].map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-3 border-b border-[#fcf0e1] last:border-0 last:pb-0">
                        <span className="text-gray-500 text-sm font-medium w-24">{item.label}</span>
                        <span className="text-gray-900 font-bold text-sm sm:text-base flex-grow text-right mr-3">{item.value}</span>
                        <button 
                          onClick={() => handleCopy(item.id === 'monto' ? totalBs : item.value, item.id)}
                          className="px-3 py-1 bg-white border border-gray-200 hover:border-gray-300 rounded-full text-xs font-bold text-gray-600 flex items-center gap-1 transition-all"
                        >
                          {copiedField === item.id ? <><CheckCircle className="w-3 h-3 text-green-500"/> Copiado</> : <><Copy className="w-3 h-3"/> Copiar</>}
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 3. ENVÍA COMPROBANTE */}
                <section>
                  <h3 className="text-lg font-black text-gray-900 mb-4">3. Envía tu comprobante</h3>
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Últimos 5 dígitos de la referencia:</label>
                    <input 
                      type="text"
                      maxLength={10}
                      value={checkoutData.paymentReference}
                      onChange={(e) => setCheckoutData({...checkoutData, paymentReference: e.target.value})}
                      placeholder="Ej: 12345"
                      className="w-full p-4 rounded-xl border-2 border-[#f5ece1] bg-[#fffbf6] focus:border-[#ff6b9d] focus:bg-white outline-none transition-colors"
                    />
                  </div>

                  <a 
                    href={`https://wa.me/${DATOS_TIENDA.telefonoWhatsApp}?text=Hola FunkyFobs, tengo dudas con mi pago del llavero...`}
                    target="_blank" rel="noopener noreferrer"
                    className="w-full py-3 mb-8 bg-[#f0fbf6] text-[#1c9c64] font-bold rounded-full border border-[#bce8d4] flex justify-center items-center gap-2 hover:bg-[#e0f5ea] transition-colors"
                  >
                    <MessageCircle className="w-5 h-5"/> ¿Problemas para pagar? Escríbenos
                  </a>

                  <div className="bg-[#fffdf9] border-2 border-[#fcf0e1] rounded-3xl p-6 text-center">
                    <div className="flex justify-between items-end mb-6">
                      <span className="text-gray-500 font-bold tracking-widest text-sm">TOTAL</span>
                      <div className="text-right">
                        <div className="text-3xl font-black text-[#f15c5c]">${totalPrice.toFixed(2)}</div>
                        <div className="text-sm font-bold text-gray-500 mt-1">Bs. {totalBs}</div>
                      </div>
                    </div>
                    
                    <a 
                      href={generateWhatsAppLink()}
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => !isCheckoutComplete && e.preventDefault()}
                      className={`w-full py-4 font-black text-lg rounded-full shadow-lg transition-all flex items-center justify-center gap-2 ${
                        isCheckoutComplete 
                          ? 'bg-[#f15c5c] hover:bg-[#de4949] text-white hover:shadow-red-500/30' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Enviar comprobante por WhatsApp <ArrowRight className="w-5 h-5" />
                    </a>
                    
                    {!isCheckoutComplete && (
                      <p className="text-xs text-red-400 font-medium mt-3">Completa todos los campos obligatorios arriba para enviar tu comprobante.</p>
                    )}

                    <button 
                      onClick={() => setCurrentView('builder')}
                      className="mt-6 text-sm font-bold text-gray-500 hover:text-gray-800 underline decoration-gray-300 underline-offset-4"
                    >
                      Volver a la edición del llavero
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#111111] text-gray-300 py-16 mt-auto">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-black tracking-tight">
              <span style={{ color: '#a052e6' }}>Funky</span><span style={{ color: '#ff6b9d' }}>Fobs</span>
            </h2>
            <div className="text-sm text-gray-400 space-y-1">
              <p>Llaveros Funky - Tienda online</p>
              <p>Accesorios para regalar o llevar Eventos.</p>
              <p>Personalizamos cada detalle para ti.</p>
            </div>
            <div className="flex gap-4 pt-4">
              <a href="https://instagram.com/funkyfobs" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#a052e6] hover:text-white transition-colors text-gray-400">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={`https://wa.me/${DATOS_TIENDA.telefonoWhatsApp}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-colors text-gray-400">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-6">Contacto</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#ff6b9d] shrink-0 mt-0.5" />
                <div>
                  <p>Valencia - Venezuela</p>
                  <p className="text-gray-500 mt-1 font-medium">Envíos a nivel nacional 📦🚚❤️</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Instagram className="w-5 h-5 text-[#a052e6] shrink-0" />
                <span className="font-medium">@funkyfobs</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-6">Enlaces</h3>
            <ul className="space-y-3 text-sm font-medium">
              <li><button onClick={() => setCurrentView('home')} className="hover:text-white transition-colors">Inicio</button></li>
              <li><button onClick={() => { setCurrentView('home'); setTimeout(() => document.getElementById('catalogo')?.scrollIntoView({behavior:'smooth'}), 100); }} className="hover:text-white transition-colors">Catálogo</button></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Icon helper
function ImageIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
      <circle cx="9" cy="9" r="2"/>
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
    </svg>
  );
}