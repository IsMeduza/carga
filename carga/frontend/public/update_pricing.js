const fs = require('fs');
const path = 'i:/finitue/carga/frontend/public/inici.html';
let html = fs.readFileSync(path, 'utf8');

// 1. We replace the entire text from <!-- Billing Toggle --> down to the end of <!-- Plans Containers -->
const startMarker = '<!-- Billing Toggle -->';
const endMarker = '<!-- Footer -->';
const startIndex = html.indexOf(startMarker);
const endIndex = html.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error('Markers not found.');
    process.exit(1);
}

const newPricingHTML = `        <!-- Persona Tabs -->
        <div class="flex flex-wrap items-center justify-center gap-3 mt-12 bg-white/40 backdrop-blur-md p-2 rounded-[2rem] border border-white/50 w-fit mx-auto shadow-sm">
          <button class="persona-tab active flex items-center gap-3 px-6 py-3 rounded-full transition-all group"
            data-category="transportistas">
            <div class="w-10 h-10 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center transition-all duration-300">
              <i data-lucide="truck" class="w-5 h-5"></i>
            </div>
            <span class="text-sm font-bold text-slate-900">Transportistas</span>
          </button>
          
          <button class="persona-tab flex items-center gap-3 px-6 py-3 rounded-full transition-all group"
            data-category="generadores">
            <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center transition-all duration-300 group-hover:bg-slate-200">
              <i data-lucide="factory" class="w-5 h-5"></i>
            </div>
            <span class="text-sm font-bold text-slate-900">Empresas/Cargadores</span>
          </button>
        </div>
      </div>

      <!-- Plans Containers -->
      <div id="plans-container" class="relative min-h-[500px]">

        <!-- Category: Transportistas -->
        <div id="plans-transportistas"
          class="plans-category grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch pt-12">
          
          <!-- Card 1 -->
          <div class="bg-white/60 backdrop-blur-xl p-8 rounded-[32px] border border-white/50 shadow-sm flex flex-col items-start gap-6 hover:shadow-md transition-all h-full">
            <div class="w-full">
              <h3 class="text-xl font-bold text-slate-900 mb-2">Básico</h3>
              <p class="text-sm text-slate-600 font-medium">Para autónomos que empiezan.</p>
            </div>
            <div class="flex flex-col gap-1">
              <div class="flex items-baseline gap-1">
                <span class="text-4xl font-bold text-slate-900">19€</span>
                <span class="text-slate-600 text-sm">/mes</span>
              </div>
            </div>
            <ul class="space-y-4 flex-1 w-full border-t border-slate-200/50 pt-6">
              <li class="flex items-center gap-3 text-sm font-medium text-slate-700">
                <i data-lucide="check" class="w-4 h-4 text-green-500"></i> Mapa de cargas en vivo
              </li>
              <li class="flex items-center gap-3 text-sm font-medium text-slate-700">
                <i data-lucide="check" class="w-4 h-4 text-green-500"></i> 1 camión gestionado
              </li>
              <li class="flex items-center gap-3 text-sm font-medium text-slate-400">
                <i data-lucide="x" class="w-4 h-4"></i> Prioridad en cargas
              </li>
            </ul>
            <button class="w-full py-4 rounded-full bg-slate-100 text-slate-900 font-bold text-sm hover:bg-slate-200 transition-colors">Seleccionar plan</button>
          </div>

          <!-- Card 2 -->
          <div class="bg-white/60 backdrop-blur-xl p-8 rounded-[32px] border border-slate-300 shadow-md flex flex-col items-start gap-6 hover:shadow-lg transition-all h-full relative">
            <span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Recomendado</span>
            <div class="w-full">
              <h3 class="text-xl font-bold text-slate-900 mb-2">Pro</h3>
              <p class="text-sm text-slate-600 font-medium">El más popular para autónomos.</p>
            </div>
            <div class="flex flex-col gap-1">
              <div class="flex items-baseline gap-1">
                <span class="text-4xl font-bold text-slate-900">39€</span>
                <span class="text-slate-600 text-sm">/mes</span>
              </div>
            </div>
            <ul class="space-y-4 flex-1 w-full border-t border-slate-200/50 pt-6">
              <li class="flex items-center gap-3 text-sm font-medium text-slate-700">
                <i data-lucide="check" class="w-4 h-4 text-green-500"></i> Prioridad alta en cargas
              </li>
              <li class="flex items-center gap-3 text-sm font-medium text-slate-700">
                <i data-lucide="check" class="w-4 h-4 text-green-500"></i> Facturación automática
              </li>
              <li class="flex items-center gap-3 text-sm font-medium text-slate-700">
                <i data-lucide="check" class="w-4 h-4 text-green-500"></i> Hasta 3 camiones
              </li>
              <li class="flex items-center gap-3 text-sm font-medium text-slate-700">
                <i data-lucide="check" class="w-4 h-4 text-green-500"></i> Seguimiento GPS básico
              </li>
            </ul>
            <button class="w-full py-4 rounded-full bg-[#1A1A1A] text-white font-bold text-sm hover:bg-black transition-colors">Comenzar 14 días gratis</button>
          </div>

          <!-- Card 3 -->
          <div class="bg-white/60 backdrop-blur-xl p-8 rounded-[32px] border border-white/50 shadow-sm flex flex-col items-start gap-6 hover:shadow-md transition-all h-full">
            <div class="w-full">
              <h3 class="text-xl font-bold text-slate-900 mb-2">Max</h3>
              <p class="text-sm text-slate-600 font-medium">Para transportistas de élite.</p>
            </div>
            <div class="flex flex-col gap-1">
              <div class="flex items-baseline gap-1">
                <span class="text-4xl font-bold text-slate-900">59€</span>
                <span class="text-slate-600 text-sm">/mes</span>
              </div>
            </div>
            <ul class="space-y-4 flex-1 w-full border-t border-slate-200/50 pt-6">
              <li class="flex items-center gap-3 text-sm font-medium text-slate-700">
                <i data-lucide="check" class="w-4 h-4 text-green-500"></i> Prioridad máxima (VIP)
              </li>
              <li class="flex items-center gap-3 text-sm font-medium text-slate-700">
                <i data-lucide="check" class="w-4 h-4 text-green-500"></i> Camiones ilimitados
              </li>
              <li class="flex items-center gap-3 text-sm font-medium text-slate-700">
                <i data-lucide="check" class="w-4 h-4 text-green-500"></i> Soporte 24/7 dedicado
              </li>
              <li class="flex items-center gap-3 text-sm font-medium text-slate-700">
                <i data-lucide="shield-check" class="w-4 h-4 text-blue-500"></i> Sello de Verificado Premium
              </li>
            </ul>
            <button class="w-full py-4 rounded-full bg-slate-100 text-slate-900 font-bold text-sm hover:bg-slate-200 transition-colors">Seleccionar plan</button>
          </div>
        </div>

        <!-- Category: Cargadores -->
        <div id="plans-generadores"
          class="plans-category grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch pt-12 hidden">
          
          <!-- Card 1 -->
          <div class="bg-white/60 backdrop-blur-xl p-8 rounded-[32px] border border-white/50 shadow-sm flex flex-col items-start gap-6 hover:shadow-md transition-all h-full">
            <div class="w-full">
              <h3 class="text-xl font-bold text-slate-900 mb-2">Básico</h3>
              <p class="text-sm text-slate-600 font-medium">Para empresas con envíos ocasionales.</p>
            </div>
             <div class="flex flex-col gap-1">
              <div class="flex items-baseline gap-1">
                <span class="text-4xl font-bold text-slate-900">19€</span>
                <span class="text-slate-600 text-sm">/mes</span>
              </div>
            </div>
            <ul class="space-y-4 flex-1 w-full border-t border-slate-200/50 pt-6">
              <li class="flex items-center gap-3 text-sm font-medium text-slate-700">
                <i data-lucide="check" class="w-4 h-4 text-green-500"></i> Hasta 10 envíos al mes
              </li>
              <li class="flex items-center gap-3 text-sm font-medium text-slate-700">
                <i data-lucide="check" class="w-4 h-4 text-green-500"></i> Mapa de transportistas
              </li>
              <li class="flex items-center gap-3 text-sm font-medium text-slate-700">
                <i data-lucide="check" class="w-4 h-4 text-green-500"></i> Notificaciones de entrega
              </li>
            </ul>
            <button class="w-full py-4 rounded-full bg-slate-100 text-slate-900 font-bold text-sm hover:bg-slate-200 transition-colors">Empezar ahora</button>
          </div>

          <!-- Card 2 -->
          <div class="bg-white/60 backdrop-blur-xl p-8 rounded-[32px] border border-slate-300 shadow-md flex flex-col items-start gap-6 hover:shadow-lg transition-all h-full relative">
            <span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Eficiente</span>
            <div class="w-full">
              <h3 class="text-xl font-bold text-slate-900 mb-2">Pro</h3>
              <p class="text-sm text-slate-600 font-medium">Optimiza tu logística diaria.</p>
            </div>
            <div class="flex flex-col gap-1">
              <div class="flex items-baseline gap-1">
                <span class="text-4xl font-bold text-slate-900">49€</span>
                <span class="text-slate-600 text-sm">/mes</span>
              </div>
            </div>
            <ul class="space-y-4 flex-1 w-full border-t border-slate-200/50 pt-6">
              <li class="flex items-center gap-3 text-sm font-medium text-slate-700">
                <i data-lucide="check" class="w-4 h-4 text-green-500"></i> Envíos ilimitados
              </li>
              <li class="flex items-center gap-3 text-sm font-medium text-slate-700">
                <i data-lucide="check" class="w-4 h-4 text-green-500"></i> Panel de analíticas avanzado
              </li>
              <li class="flex items-center gap-3 text-sm font-medium text-slate-700">
                <i data-lucide="check" class="w-4 h-4 text-green-500"></i> Gestión de albaranes digital
              </li>
              <li class="flex items-center gap-3 text-sm font-medium text-slate-700">
                <i data-lucide="check" class="w-4 h-4 text-green-500"></i> Verificación de conductores
              </li>
            </ul>
            <button class="w-full py-4 rounded-full bg-[#1A1A1A] text-white font-bold text-sm hover:bg-black transition-colors">Comenzar 14 días gratis</button>
          </div>

          <!-- Card 3 -->
          <div class="bg-white/60 backdrop-blur-xl p-8 rounded-[32px] border border-white/50 shadow-sm flex flex-col items-start gap-6 hover:shadow-md transition-all h-full">
            <div class="w-full">
              <h3 class="text-xl font-bold text-slate-900 mb-2">Max</h3>
              <p class="text-sm text-slate-600 font-medium">Integración total para gran volumen.</p>
            </div>
            <div class="flex flex-col gap-1">
              <div class="flex items-baseline gap-1">
                <span class="text-4xl font-bold text-slate-900">99€</span>
                <span class="text-slate-600 text-sm">/mes</span>
              </div>
            </div>
            <ul class="space-y-4 flex-1 w-full border-t border-slate-200/50 pt-6">
              <li class="flex items-center gap-3 text-sm font-medium text-slate-700">
                <i data-lucide="check" class="w-4 h-4 text-green-500"></i> Integración ERP completa
              </li>
              <li class="flex items-center gap-3 text-sm font-medium text-slate-700">
                <i data-lucide="check" class="w-4 h-4 text-green-500"></i> Facturación consolidada
              </li>
              <li class="flex items-center gap-3 text-sm font-medium text-slate-700">
                <i data-lucide="check" class="w-4 h-4 text-green-500"></i> Soporte estratégico dedicado
              </li>
              <li class="flex items-center gap-3 text-sm font-medium text-slate-700">
                <i data-lucide="check" class="w-4 h-4 text-green-500"></i> Acceso multi-usuario y roles
              </li>
            </ul>
            <button class="w-full py-4 rounded-full bg-slate-100 text-slate-900 font-bold text-sm hover:bg-slate-200 transition-colors">Seleccionar plan</button>
          </div>
        </div>

      </div>
    </section>
    `;

html = html.substring(0, startIndex) + newPricingHTML + html.substring(endIndex);

// Also remove opacity:0 classes in the header so it shows immediately without animation
html = html.replace('Planes y Precios\n        </span>', 'Planes y Precios\n        </span>');
html = html.replace('style="opacity:0;"', '');
html = html.replace('style="opacity:0;"', '');
html = html.replace('style="opacity:0;"', '');
html = html.replace('style="opacity:0;"', '');

// Remove the JS billing logic since toggle is gone
html = html.replace(/\/\/ ========== BILLING TOGGLE ==========[\s\S]*?\/\/ ========== PRICING ANIMATIONS ==========/g, '// ========== PRICING ANIMATIONS ==========');
// Remove pricing animation block completely
html = html.replace(/\/\/ ========== PRICING ANIMATIONS ==========[\s\S]*?\/\/ ========== NUMBER ANIMATION ==========/g, '// ========== NUMBER ANIMATION ==========');
// Remove number animation completely
html = html.replace(/\/\/ ========== NUMBER ANIMATION ==========[\s\S]*?\/\/ ========== DASHBOARD TABS ==========/g, '// ========== DASHBOARD TABS ==========');

// Subtle parallax is fine, but maybe let's drop it from pricing-card, which no longer exist (classes removed)

fs.writeFileSync(path, html, 'utf8');
console.log('Update successful.');
