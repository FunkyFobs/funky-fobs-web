import React, { useState, useEffect } from 'react';
import { 
  Check, ChevronRight, Sparkles, Type, Link as LinkIcon, 
  Palette, MapPin, Camera, MessageCircle, Wand2, 
  Star, ArrowRight, Copy, CheckCircle, Package, CreditCard, Search 
} from 'lucide-react';
import { 
  DATOS_TIENDA, 
  PRECIOS_EXTRAS, 
  CORD_COLORS, 
  KNOT_TYPES, 
  CLASP_TYPES, 
  PASADORES, 
  COLGANTES,
  CATALOGO_FAVORITOS, 
  LETTER_STYLES,
  PAGO_MOVIL_DATA
} from './Data';

export default function FunkyFobsApp() {
  const [previewItem, setPreviewItem] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(DATOS_TIENDA.tasaManual);
  const [currentView, setCurrentView] = useState('home'); 
  const [currentStep, setCurrentStep] = useState(1);
  
  // 1. EL ESTADO: pasador ahora es un arreglo []
  const [selections, setSelections] = useState({
    baseModel: CATALOGO_FAVORITOS[0],
    cord: null,
    knot: null,
    clasp: null,
    pasadores: [], 
    letterStyle: [],
    text: '',
    colgantes: [],
    argollaPremium: false
  });

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

  // 2. FUNCIÓN DE SELECCIÓN MÚLTIPLE DE PASADORES
  const togglePasador = (pasador) => {
    setSelections(prev => {
      if (pasador.isNone || pasador.name.toLowerCase() === 'ninguno') {
        return { ...prev, pasadores: [pasador] };
      }
      const current = prev.pasadores.filter(p => !p.isNone && p.name?.toLowerCase() !== 'ninguno');
      const exists = current.find(p => p.id === pasador.id);
      if (exists) {
        return { ...prev, pasadores: current.filter(p => p.id !== pasador.id) };
      }
      return { ...prev, pasadores: [...current, pasador] };
    });
  };

  // Filtramos los pasadores reales (ignorando "Ninguno") para cálculos y UI
  const pasadoresValidos = selections.pasadores.filter(p => !p.isNone && p.name?.toLowerCase() !== 'ninguno');

  const calculateTotal = () => {
    const modeloBase = selections.baseModel;
    if (!modeloBase || !modeloBase.inclusions) return 10; 

    let total = modeloBase.basePrice;
    const inc = modeloBase.inclusions;

    // Letras
    const cantidadLetras = selections.text.trim().length;
    if (cantidadLetras > inc.letras) {
      const extras = cantidadLetras - inc.letras;
      total += extras * PRECIOS_EXTRAS.letra; 
    }

    // Pasadores
    const cantidadPasadores = pasadoresValidos.length;
    if (cantidadPasadores > inc.pasadores) {
      const extras = cantidadPasadores - inc.pasadores;
      const pasadoresOjoTurco = pasadoresValidos.filter(p => p.id === 'ojo-turco').length;
      const excedenteOjoTurco = Math.min(extras, pasadoresOjoTurco);
      const excedenteNormal = extras - excedenteOjoTurco;
      total += (excedenteOjoTurco * PRECIOS_EXTRAS.ojoTurco) + (excedenteNormal * PRECIOS_EXTRAS.pasador);
    }

    // Colgantes
    const cantidadColgantes = selections.colgantes.length;
    if (cantidadColgantes > inc.colgantes) {
      const extras = cantidadColgantes - inc.colgantes;
      const colgantesMuneco = selections.colgantes.filter(c => c.isMuneco).length;
      const excedenteMuneco = Math.min(extras, colgantesMuneco);
      const excedentePerrito = extras - excedenteMuneco;
      
      total += (excedenteMuneco * PRECIOS_EXTRAS.colganteMuneco) + (excedentePerrito * PRECIOS_EXTRAS.colgantePerrito);
    }

    // Argolla Premium
    if ((modeloBase.id === 'strap-largo' || modeloBase.id === 'strap-mano') && selections.argollaPremium) {
      total += PRECIOS_EXTRAS.argollaPremium;
    }

    return total;
  };

  const totalPrice = calculateTotal();
  const totalBs = (totalPrice * exchangeRate).toFixed(2);

  const isComplete = Boolean(
    selections.cord && 
    (selections.knot || selections.baseModel?.id === 'cat1') && 
    selections.clasp && 
    selections.pasadores.length > 0 &&
    selections.letterStyle.length > 0 && 
    selections.text.trim().length > 0
  );

  const isCheckoutComplete = 
    checkoutData.shippingMethod && 
    (checkoutData.shippingMethod === 'Retiro Personal' || (checkoutData.shippingAddress && checkoutData.shippingAddress.trim() !== '')) && 
    checkoutData.shippingId && 
    checkoutData.customerName && 
    checkoutData.customerPhone && 
    checkoutData.paymentReference;

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

    const inc = selections.baseModel.inclusions;
    const cantidadLetras = selections.text.trim().length;
    const cantidadPasadores = pasadoresValidos.length;
    const cantidadColgantes = selections.colgantes.length;

    const extrasLetras = Math.max(0, cantidadLetras - inc.letras);
    const extrasPasadores = Math.max(0, cantidadPasadores - inc.pasadores);
    const extrasColgantes = Math.max(0, cantidadColgantes - inc.colgantes);

    const detalleExtras = [
      extrasLetras > 0 ? `• ${extrasLetras} letra(s) extra` : null,
      extrasPasadores > 0 ? `• ${extrasPasadores} pasador(es) extra` : null,
      extrasColgantes > 0 ? `• ${extrasColgantes} colgante(s) extra` : null,
      selections.argollaPremium ? '• Argolla Premium' : null,
    ].filter(Boolean);

    const message = [
      '¡Hola FunkyFobs! 💖 Aquí está mi pedido y comprobante de pago:',
      '',
      '*1. DISEÑO DEL LLAVERO*',
      `🛍️ Modelo Base: ${selections.baseModel.name} ($${selections.baseModel.basePrice.toFixed(2)})`,
      `🏷️ Nombre: ${selections.text}`,
      `🎨 Letras: ${selections.letterStyle?.length > 0 ? selections.letterStyle.map(style => style.name).join(', ') : '-'}`,
      `🧶 Cuerda: ${selections.cord.name}`,
      `🪢 Nudo: ${selections.baseModel?.id === 'cat1' ? 'Nudo Simple' : selections.knot?.name}`,
      `🔗 Sujetador: ${selections.clasp.name}`,
      ...(cantidadPasadores > 0 ? [`⭐ Pasadores: ${pasadoresValidos.map(item => item.name).join(', ')}`] : []),
      ...(cantidadColgantes > 0 ? [`✨ Colgantes: ${selections.colgantes.map(item => item.name).join(', ')}`] : []),
      ...(detalleExtras.length > 0 ? ['', '➕ *Detalle de Extras agregados:*', ...detalleExtras] : []),
      '',
      '*2. DATOS DE ENVÍO*',
      `🚚 Método de entrega: ${checkoutData.shippingMethod}`,
      ...(checkoutData.shippingMethod !== 'Retiro Personal' ? [`📍 Dirección: ${checkoutData.shippingAddress}`] : []),
      `🪪 Cédula: ${checkoutData.shippingId}`,
      `👤 Nombre: ${checkoutData.customerName}`,
      `📱 Teléfono: ${checkoutData.customerPhone}`,
      ...(checkoutData.extraNotes.trim() ? [`📝 Detalles: ${checkoutData.extraNotes}`] : []),
      '',
      '*3. DATOS DEL PAGO*',
      `🔢 Referencia: ${checkoutData.paymentReference}`,
      `💵 Total: $${totalPrice.toFixed(2)} (Bs. ${totalBs})`,
      '',
      'Adjunto el comprobante de pago.',
    ].join('\n');

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
                  onClick={() => {
                    if (cord.agotado) return; 
                    updateSelection('cord', cord);
                  }}
                  className={`flex flex-col items-center gap-2 p-2 rounded-xl border-2 transition-all ${
                    cord.agotado
                      ? 'opacity-60 grayscale cursor-not-allowed border-gray-100'
                      : selections.cord?.id === cord.id 
                        ? 'border-[#a052e6] bg-purple-50 shadow-sm' 
                        : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div className=" relative w-full aspect-square rounded-lg shadow-sm overflow-hidden bg-gray-100">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewItem(cord);
                      }}
                      className="absolute top-2 left-2 z-10 w-7 h-7 bg-white/90 hover:bg-white text-purple-600 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110 cursor-pointer"
                      title="Ver en grande"
                    >
                      <Search className="w-4 h-4" />
                    </div>
                    {cord.image ? <img src={cord.image} alt={cord.name} className="w-full h-full object-cover" onContextMenu={(e) => e.preventDefault()} onDragStart={(e) => e.preventDefault()} draggable={false} /> : <div className="w-full h-full" style={{backgroundColor: cord.hexFallback}} onContextMenu={(e) => e.preventDefault()} onDragStart={(e) => e.preventDefault()} draggable={false} />}
                    
                    {cord.agotado && (
                      <div className="absolute inset-0 flex items-center justify-center z-20 bg-white/30 backdrop-blur-[2px]">
                        <span className="bg-red-500 text-white text-[11px] font-black px-2 py-1 rounded shadow-md transform -rotate-12 uppercase tracking-wider">
                          Agotado
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{cord.name}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        if (selections.baseModel?.id === 'cat1') {
          return (
            <div className="space-y-4 animate-in fade-in flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mb-2 shadow-inner border border-purple-100">
                <LinkIcon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-gray-800">¡Nudo Simple Incluido! 🪢</h3>
              <p className="text-gray-500 max-w-sm mt-2 font-medium">
                El <strong>{selections.baseModel.name}</strong> lleva su nudo clásico de fábrica, por lo que no necesitas escoger uno.
              </p>
              <button 
                onClick={() => setCurrentStep(3)}
                className="mt-6 px-6 py-2.5 bg-purple-100 text-purple-700 font-bold rounded-full hover:bg-purple-200 transition-colors flex items-center gap-2"
              >
                Siguiente paso <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          );
        }
        return (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-purple-500" /> Tipo de Nudo
            </h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {KNOT_TYPES.map(knot => (
                <button
                  key={knot.id}
                  onClick={() => {
                    if (knot.agotado) return;
                    updateSelection('knot', knot);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left relative overflow-hidden ${
                    knot.agotado
                      ? 'opacity-60 grayscale cursor-not-allowed border-gray-100 bg-gray-50'
                      : selections.knot?.id === knot.id ? 'border-[#ff6b9d] bg-pink-50' : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  {knot.agotado && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 bg-white/30 backdrop-blur-[1px]">
                      <span className="bg-red-500 text-white text-[11px] font-black px-2 py-1 rounded shadow-md transform -rotate-12 uppercase tracking-wider">Agotado</span>
                    </div>
                  )}
                  <div className="relative w-20 h-20 rounded bg-gray-200 overflow-hidden shrink-0">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewItem(knot);
                      }}
                      className="absolute top-0.5 left-0.5 z-10 w-5 h-5 bg-white/90 hover:bg-white text-purple-600 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110 cursor-pointer"
                      title="Ver en grande"
                    >
                      <Search className="w-3 h-3" />
                    </div>
                    {knot.image && <img src={knot.image} alt={knot.name} className="w-full h-full object-cover" onContextMenu={(e) => e.preventDefault()} onDragStart={(e) => e.preventDefault()} draggable={false}  />}
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
                onClick={() => {
                  if (clasp.agotado) return;
                  updateSelection('clasp', clasp);
                }}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all relative overflow-hidden ${
                  clasp.agotado
                    ? 'opacity-60 grayscale cursor-not-allowed border-gray-100 bg-gray-50'
                    : selections.clasp?.id === clasp.id ? 'border-[#a052e6] bg-purple-50' : 'border-gray-100 hover:border-gray-300'
                }`}
              >
                {clasp.agotado && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 bg-white/30 backdrop-blur-[1px]">
                      <span className="bg-red-500 text-white text-[11px] font-black px-2 py-1 rounded shadow-md transform -rotate-12 uppercase tracking-wider">Agotado</span>
                    </div>
                )}
                <div className="relative w-full h-32 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewItem(clasp); 
                    }}
                    className="absolute top-1.5 left-1.5 z-10 w-6 h-6 bg-white/90 hover:bg-white text-purple-600 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110 cursor-pointer"
                    title="Ver en grande"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </div>
                  {clasp.image && (
                    <img 
                      src={clasp.image} 
                      alt={clasp.name} 
                      className="w-full h-full object-contain p-2 transition-transform duration-300 hover:scale-110"
                      onContextMenu={(e) => e.preventDefault()} onDragStart={(e) => e.preventDefault()} draggable={false}  
                    />
                  )}
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
             <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-500" /> Pasadores
              </h3>
              <span className="text-sm font-bold text-purple-600">Desde +${PRECIOS_EXTRAS.pasador.toFixed(2)} c/ extra</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {PASADORES.map(pasador => {
                const isSelected = selections.pasadores.some(p => p.id === pasador.id);
                return (
                <button
                  key={pasador.id}
                  onClick={() => {
                    if (pasador.agotado) return;
                    togglePasador(pasador);
                  }}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all relative overflow-hidden ${
                    pasador.agotado
                      ? 'opacity-60 grayscale cursor-not-allowed border-gray-100 bg-gray-50'
                      : isSelected ? 'border-[#a052e6] bg-purple-50' : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  {pasador.agotado && (
                      <div className="absolute inset-0 flex items-center justify-center z-20 bg-white/30 backdrop-blur-[1px]">
                        <span className="bg-red-500 text-white text-[11px] font-black px-2 py-1 rounded shadow-md transform -rotate-12 uppercase tracking-wider">Agotado</span>
                      </div>
                  )}
                  <div className="relative w-full h-32 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewItem(pasador);
                      }}
                      className="absolute top-1.5 left-1.5 z-10 w-6 h-6 bg-white/90 hover:bg-white text-purple-600 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110 cursor-pointer"
                      title="Ver en grande"
                    >
                      <Search className="w-3.5 h-3.5" />
                    </div>
                    {pasador.image ? (
                      <img src={pasador.image} alt={pasador.name} className="w-full h-full object-contain p-2 transition-transform duration-300 hover:scale-110" onContextMenu={(e) => e.preventDefault()} onDragStart={(e) => e.preventDefault()} draggable={false} />
                    ) : (
                      <span className="text-gray-400 font-medium text-sm">Ninguno</span>
                    )}
                  </div>
                  <span className="font-bold text-sm text-gray-700">{pasador.name}</span>
                </button>
              )})}
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
              <label className="text-sm font-semibold text-gray-600 block">
                1. Color de letras: <span className="text-xs font-normal text-purple-500">(Puedes elegir varios)</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {LETTER_STYLES.map(style => {
                  const currentStyles = Array.isArray(selections.letterStyle) ? selections.letterStyle : [];
                  const isSelected = currentStyles.some(s => s.id === style.id);

                  return (
                    <button
                      key={style.id}
                      onClick={() => {
                        if (style.agotado) return;
                        if (isSelected) {
                          updateSelection('letterStyle', currentStyles.filter(s => s.id !== style.id));
                        } else {
                          updateSelection('letterStyle', [...currentStyles, style]);
                        }
                      }}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all relative overflow-hidden ${
                        style.agotado
                          ? 'opacity-60 grayscale cursor-not-allowed border-gray-100 bg-gray-50'
                          : isSelected ? 'border-[#a052e6] bg-purple-50 scale-105' : 'border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      {style.agotado && (
                        <div className="absolute inset-0 flex items-center justify-center z-20 bg-white/30 backdrop-blur-[1px]">
                          <span className="bg-red-500 text-white text-[11px] font-black px-2 py-1 rounded shadow-md transform -rotate-12 uppercase tracking-wider">Agotado</span>
                        </div>
                      )}
                      <div className="relative w-full h-12 rounded bg-gray-200 overflow-hidden">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewItem(style);
                          }}
                          className="absolute top-0.5 left-0.5 z-10 w-5 h-5 bg-white/90 hover:bg-white text-purple-600 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110 cursor-pointer"
                          title="Ver en grande"
                        >
                          <Search className="w-3 h-3" />
                        </div>
                        {style.image && <img src={style.image} alt={style.name} className="w-full h-full object-cover" onContextMenu={(e) => e.preventDefault()} onDragStart={(e) => e.preventDefault()} draggable={false}  />}
                      </div>
                      <span className="text-xs font-bold text-gray-700 text-center">{style.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 flex justify-between">
                <span>2. Escribe el nombre:</span>
                <span className="text-purple-600 font-bold">+${PRECIOS_EXTRAS.letra.toFixed(2)} c/ extra</span>
              </label>
              <input
  type="text"
  maxLength={12}
  value={selections.text}
  onChange={(e) => {
    // Solo permite letras (incluyendo Ñ) y números. 
    const textoLimpio = e.target.value.replace(/[^a-zA-Z0-9\sÑñ]/g, '');
    updateSelection('text', textoLimpio.toUpperCase());
  }}
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
              <span className="text-sm font-bold text-purple-600">Desde +${PRECIOS_EXTRAS.colgantePerrito.toFixed(2)} c/ extra</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {COLGANTES.map(colgante => {
                const isSelected = selections.colgantes.some(c => c.id === colgante.id);
                return (
                  <button
                    key={colgante.id}
                    onClick={() => {
                      if (colgante.agotado) return;
                      toggleColgante(colgante);
                    }}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all relative overflow-hidden ${
                      colgante.agotado
                        ? 'opacity-60 grayscale cursor-not-allowed border-gray-100 bg-gray-50'
                        : isSelected ? 'border-[#a052e6] bg-purple-50 scale-105' : 'border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    {colgante.agotado && (
                      <div className="absolute inset-0 flex items-center justify-center z-20 bg-white/30 backdrop-blur-[1px]">
                        <span className="bg-red-500 text-white text-[11px] font-black px-2 py-1 rounded shadow-md transform -rotate-12 uppercase tracking-wider">Agotado</span>
                      </div>
                    )}
                    <div className="relative w-full aspect-square bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewItem(colgante);
                        }}
                        className="absolute top-1.5 left-1.5 z-10 w-6 h-6 bg-white/90 hover:bg-white text-purple-600 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110 cursor-pointer"
                        title="Ver en grande"
                      >
                        <Search className="w-3.5 h-3.5" />
                      </div>
                      {colgante.image && (
                        <img 
                          src={colgante.image} 
                          alt={colgante.name} 
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
                          onContextMenu={(e) => e.preventDefault()} 
                          onDragStart={(e) => e.preventDefault()} 
                          draggable={false} 
                        />
                      )}
                    </div>
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
        <div className="max-w-6xl mx-auto px-2 md:px-4 h-16 md:h-20 flex items-center justify-between">
          <button onClick={() => setCurrentView('home')} className="hover:scale-105 transition-transform flex items-center gap-2 md:gap-3 shrink-0">
            <img 
              src="Logo.jpeg" 
              alt="Logo Funky Fobs" 
              className="h-10 w-10 sm:h-14 sm:w-14 rounded-full object-cover shadow-md border-2 border-white shrink-0"
            />
            <span className="hidden sm:block font-black text-xl md:text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#a052e6] to-[#ff6b9d] shrink-0">
              Funky Fobs
            </span>
          </button>

          <div className="flex items-center gap-1 md:gap-4 text-[10px] md:text-sm font-bold">
            <button 
              onClick={() => setCurrentView('home')} 
              className="px-2 md:px-4 py-1.5 md:py-2 text-gray-600 hover:text-[#a052e6] bg-gray-50 hover:bg-purple-50 rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-sm"
            >
              Inicio
            </button>
            <button 
              onClick={() => { setCurrentView('home'); setTimeout(() => document.getElementById('catalogo')?.scrollIntoView({behavior:'smooth'}), 100); }} 
              className="px-2 md:px-4 py-1.5 md:py-2 text-gray-600 hover:text-[#ff6b9d] bg-gray-50 hover:bg-pink-50 rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-sm"
            >
              Catálogo
            </button>
            <a 
              href={`https://wa.me/${DATOS_TIENDA.telefonoWhatsApp}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-2 md:px-4 py-1.5 md:py-2 text-white bg-gradient-to-r from-[#a052e6] to-[#ff6b9d] hover:from-[#8b43cc] hover:to-[#e65a8d] rounded-full shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex items-center gap-1"
            >
              <MessageCircle className="w-3 h-3 md:w-4 md:h-4" /> 
              Contacto
            </a>
            <button 
              onClick={startBuilding}
              className="bg-gradient-to-r from-[#a052e6] to-[#ff6b9d] text-white px-5 py-2.5 rounded-full font-bold shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-105 transition-all flex items-center gap-2"
            >
              <span className="hidden sm:inline">Armar Llavero</span> <Wand2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-grow flex flex-col w-full">
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
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-tight">
                    Lleva tu nombre con <span className="text-pink-500">mucho estilo</span>
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
                  <div className="relative w-[85%] h-[85%] bg-pink-100 rounded-[2rem] shadow-2xl shadow-pink-900/20 overflow-hidden group">
                    <img 
                      src="/llavero-hero.jpg" 
                      alt="Llavero Personalizado Funky Fobs" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      onContextMenu={(e) => e.preventDefault()} onDragStart={(e) => e.preventDefault()} draggable={false} 
                    />
                    <div className="absolute top-4 left-4 text-pink-500 font-black tracking-tight bg-white/90 backdrop-blur-sm w-fit px-4 py-1.5 rounded-full shadow-lg text-sm uppercase">
                      Diseño Exclusivo
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
                      <div className={`relative aspect-[4/5] ${item.bgColor} rounded-3xl overflow-hidden mb-4 border-8 border-gray-50 transition-transform group-hover:scale-[1.02] duration-300 cursor-pointer`} onClick={() => setPreviewItem(item)}>
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-110" onContextMenu={(e) => e.preventDefault()} onDragStart={(e) => e.preventDefault()} draggable={false} />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-300 overflow-hidden">
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
                          onClick={() => {
                            setSelections({ ...selections, baseModel: item }); 
                            setCurrentView('builder');
                            window.scrollTo({ top: 0, behavior: 'smooth' }); 
                          }}
                          className="w-full flex justify-center items-center gap-2 text-sm font-bold text-gray-800 bg-gray-100 py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors mt-2"
                        >
                          Crear este diseño <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {currentView === 'builder' && (
          <div className="w-full py-12 max-w-6xl mx-auto px-4 animate-in slide-in-from-bottom-8 duration-500">
             <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-black text-gray-900">Arma tu Llavero 🪄</h2>
                <p className="text-gray-500 mt-2 font-medium">Sigue los pasos y personaliza cada detalle.</p>
             </div>
             <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                <div className="w-full lg:w-3/5 bg-white rounded-3xl shadow-xl shadow-purple-900/5 border border-purple-100/50 overflow-hidden flex flex-col">
                 <div className="flex bg-gray-50 p-2 overflow-x-auto hide-scrollbar border-b border-gray-100 gap-2 flex-nowrap justify-start lg:justify-between">
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
                        className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
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

                <div className="w-full lg:w-2/5 flex flex-col gap-6 lg:sticky top-28">
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-3xl p-6 shadow-sm select-none">
                    <h3 className="text-xl font-black text-gray-800 mb-4">Resumen de tu Diseño</h3>

                    <div className="flex justify-between items-center mb-3 pb-3 border-b-2 border-gray-200 border-dashed">
                      <span className="font-bold text-gray-700">{selections.baseModel?.name}</span>
                      <span className="font-black text-lg text-gray-900">${selections.baseModel?.basePrice?.toFixed(2)}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 font-medium">Letras ({selections.text.trim().length}/{selections.baseModel?.inclusions?.letras})</span>
                        {selections.text.trim().length > (selections.baseModel?.inclusions?.letras || 0) ? (
                          <span className="font-bold text-pink-500 bg-pink-100 px-2 py-1 rounded-lg">
                            +{selections.text.trim().length - selections.baseModel.inclusions.letras} extra
                          </span>
                        ) : (
                          <span className="font-bold text-green-600 bg-green-100 px-2 py-1 rounded-lg">Incluidas</span>
                        )}
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 font-medium">Pasadores ({pasadoresValidos.length}/{selections.baseModel?.inclusions?.pasadores})</span>
                        {pasadoresValidos.length > (selections.baseModel?.inclusions?.pasadores || 0) ? (
                          <span className="font-bold text-pink-500 bg-pink-100 px-2 py-1 rounded-lg">
                            +{pasadoresValidos.length - selections.baseModel.inclusions.pasadores} extra
                          </span>
                        ) : (
                          <span className="font-bold text-green-600 bg-green-100 px-2 py-1 rounded-lg">Incluidos</span>
                        )}
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 font-medium">Colgantes ({selections.colgantes.length}/{selections.baseModel?.inclusions?.colgantes})</span>
                        {selections.colgantes.length > (selections.baseModel?.inclusions?.colgantes || 0) ? (
                          <span className="font-bold text-pink-500 bg-pink-100 px-2 py-1 rounded-lg">
                            +{selections.colgantes.length - selections.baseModel.inclusions.colgantes} extra
                          </span>
                        ) : (
                          <span className="font-bold text-green-600 bg-green-100 px-2 py-1 rounded-lg">Incluidos</span>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t-2 border-gray-200 flex justify-between items-center">
                      <span className="text-gray-500 font-bold uppercase tracking-wider text-sm">Total estimado</span>
                      <span className="text-4xl font-black text-indigo-600">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  {!isComplete && (
                    <div className="bg-yellow-50 text-yellow-800 text-xs font-medium p-3 rounded-xl mb-4 border border-yellow-200 text-center">
                      Completa todos los pasos obligatorios (1 al 5) para poder hacer tu pedido.
                    </div>
                  )}

                  <div className="bg-[#fff0f5] border-2 border-[#ffb6c1] rounded-xl p-4 flex items-start gap-3 animate-in slide-in-from-bottom-2">
                    <span className="text-2xl mt-1">📸</span>
                    <div>
                      <p className="text-sm font-bold text-[#d84074]">¡Importante sobre tu pago!</p>
                      <p className="text-xs text-gray-700 mt-1">
                        Al enviar tu pedido en el siguiente paso, serás redirigido a WhatsApp. <strong>Recuerda adjuntar ahí mismo la foto/capture de tu transferencia</strong> para poder procesar tu llavero.
                      </p>
                    </div>
                  </div>

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

                <section className="mb-10">
                  <h3 className="text-lg font-black text-gray-900 mb-4">Datos de envío</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Método de entrega:</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {['MRW', 'ZOOM', 'Retiro Personal'].map(method => (
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
                    
                    {checkoutData.shippingMethod !== 'Retiro Personal' && (
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Dirección de {checkoutData.shippingMethod}:</label>
                        <textarea 
                          rows="3"
                          value={checkoutData.shippingAddress}
                          onChange={(e) => setCheckoutData({...checkoutData, shippingAddress: e.target.value.replace(/[<>{};=]/g, '')})}
                          placeholder="Calle, urbanización, punto de referencia..."
                          className="w-full p-4 rounded-xl border-2 border-[#f5ece1] bg-[#fffbf6] focus:border-[#ff6b9d] focus:bg-white outline-none resize-none transition-colors"
                        ></textarea>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Cédula de quien recibe:</label>
                      <input 
                        type="text"
                        value={checkoutData.shippingId}
                        onChange={(e) => setCheckoutData({...checkoutData, shippingId: e.target.value.replace(/[^0-9VEve\-]/g, '')})}
                        placeholder="Ej: 12345678"
                        className="w-full p-4 rounded-xl border-2 border-[#f5ece1] bg-[#fffbf6] focus:border-[#ff6b9d] focus:bg-white outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Nombre y Apellido:</label>
                      <input 
                        type="text"
                        value={checkoutData.customerName}
                        onChange={(e) => setCheckoutData({...checkoutData, customerName: e.target.value.replace(/[^a-zA-Z\sñÑáéíóúÁÉÍÓÚ]/g, '')})}
                        placeholder="Ej: Maria Pérez"
                        className="w-full p-4 rounded-xl border-2 border-[#f5ece1] bg-[#fffbf6] focus:border-[#ff6b9d] focus:bg-white outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Teléfono (WhatsApp):</label>
                      <input 
                        type="text"
                        value={checkoutData.customerPhone}
                        onChange={(e) => setCheckoutData({...checkoutData, customerPhone: e.target.value.replace(/[^0-9+\s\-]/g, '')})}
                        placeholder="Ej: 04145687437"
                        className="w-full p-4 rounded-xl border-2 border-[#f5ece1] bg-[#fffbf6] focus:border-[#ff6b9d] focus:bg-white outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Detalles adicionales <span className="text-xs font-normal text-gray-400 ml-1 bg-gray-100 px-2 py-0.5 rounded-full">OPCIONAL</span></label>
                      <textarea 
                        rows="2"
                        value={checkoutData.extraNotes}
                        onChange={(e) => setCheckoutData({...checkoutData, extraNotes: e.target.value.replace(/[<>{};=]/g, '')})}
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
                        <p className="font-bold text-sm text-gray-800">
                          {checkoutData.shippingMethod === 'Retiro Personal' ? 'Retiro en Valencia' : 'Envío por MRW o ZOOM'}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {checkoutData.shippingMethod === 'Retiro Personal' ? 'Te indicaremos la dirección exacta por WhatsApp.' : 'Enviamos a nivel nacional (Cobro a destino).'}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

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
                
                <div className="bg-[#fff0f5] border-2 border-[#ffb6c1] rounded-xl p-4 mb-4 mt-6 flex items-start gap-3 animate-in slide-in-from-bottom-2">
                  <span className="text-2xl mt-1">📸</span>
                  <div>
                    <p className="text-sm font-bold text-[#d84074]">¡Importante sobre tu pago!</p>
                    <p className="text-xs text-gray-700 mt-1">
                      Al enviar tu pedido en el siguiente paso, serás redirigido a WhatsApp. <strong>Recuerda adjuntar ahí mismo la foto/capture de tu transferencia</strong> para poder procesar tu llavero.
                    </p>
                  </div>
                </div>

                <section>
                  <h3 className="text-lg font-black text-gray-900 mb-4">3. Envía tu comprobante</h3>
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Últimos 5 dígitos de la referencia:</label>
                    <input 
  type="text"
  maxLength={10}
  value={checkoutData.paymentReference}
  onChange={(e) => setCheckoutData({...checkoutData, paymentReference: e.target.value.replace(/[^0-9]/g, '')})}
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
                <Camera className="w-5 h-5" />
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
                <Camera className="w-6 h-6 text-pink-500" />
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

      {previewItem && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="relative max-w-md w-full bg-white rounded-3xl p-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewItem(null)}
              className="absolute -top-3 -right-3 bg-white text-gray-700 hover:text-black shadow-md rounded-full w-9 h-9 flex items-center justify-center font-bold text-lg z-10 border"
            >
              ✕
            </button>
            <img
              src={previewItem.image}
              alt={previewItem.name}
              className="w-full h-auto max-h-[75vh] object-contain select-none pointer-events-none"
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              draggable={false}
            />
            <div className="p-3 text-center">
              <h3 className="text-lg font-bold text-gray-800">{previewItem.name}</h3>
              {previewItem.badge && (
                <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-bold mt-1 ${previewItem.badgeColor}`}>
                  {previewItem.badge}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ImageIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
      <circle cx="9" cy="9" r="2"/>
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
    </svg>
  );
}