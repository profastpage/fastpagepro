module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/context/LanguageContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LanguageProvider",
    ()=>LanguageProvider,
    "useLanguage",
    ()=>useLanguage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const DEFAULT_LANGUAGE = "en";
const LanguageContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const MOJIBAKE_PATTERN = /Ã|Â|â|ð|ï¿½|�/;
const CP1252_TO_BYTE = {
    0x20ac: 0x80,
    0x201a: 0x82,
    0x0192: 0x83,
    0x201e: 0x84,
    0x2026: 0x85,
    0x2020: 0x86,
    0x2021: 0x87,
    0x02c6: 0x88,
    0x2030: 0x89,
    0x0160: 0x8a,
    0x2039: 0x8b,
    0x0152: 0x8c,
    0x017d: 0x8e,
    0x2018: 0x91,
    0x2019: 0x92,
    0x201c: 0x93,
    0x201d: 0x94,
    0x2022: 0x95,
    0x2013: 0x96,
    0x2014: 0x97,
    0x02dc: 0x98,
    0x2122: 0x99,
    0x0161: 0x9a,
    0x203a: 0x9b,
    0x0153: 0x9c,
    0x017e: 0x9e,
    0x0178: 0x9f
};
function toLikelyUtf8Bytes(input) {
    const bytes = [];
    for (const char of input){
        const codePoint = char.codePointAt(0) || 0;
        if (codePoint <= 0xff) {
            bytes.push(codePoint);
            continue;
        }
        const cp1252Byte = CP1252_TO_BYTE[codePoint];
        bytes.push(typeof cp1252Byte === "number" ? cp1252Byte : 0x3f);
    }
    return Uint8Array.from(bytes);
}
function decodeUtf8Safely(bytes) {
    try {
        return new TextDecoder("utf-8", {
            fatal: true
        }).decode(bytes);
    } catch  {
        return null;
    }
}
function fixMojibake(value) {
    let result = value;
    for(let i = 0; i < 4; i += 1){
        if (!MOJIBAKE_PATTERN.test(result)) break;
        const bytes = toLikelyUtf8Bytes(result);
        const decoded = decodeUtf8Safely(bytes);
        if (!decoded || decoded === result) break;
        result = decoded;
    }
    return result.replace("Consultorï¿½a, jurídico e serviços. Profissional e confiável.", "Consultoria, jurídico e serviços. Profissional e confiável.");
}
const translations = {
    // Nav
    "nav.home": {
        es: "Inicio",
        en: "Home",
        pt: "InÃƒÂ­cio"
    },
    "nav.builder": {
        es: "Constructor",
        en: "Builder",
        pt: "Construtor"
    },
    "nav.templates": {
        es: "Plantillas",
        en: "Templates",
        pt: "Modelos"
    },
    "nav.cloner": {
        es: "Clonador",
        en: "Cloner",
        pt: "Clonador"
    },
    "nav.store": {
        es: "Tienda Online",
        en: "Online Store",
        pt: "Loja Online"
    },
    "nav.linkhub": {
        es: "Carta Digital",
        en: "Digital Menu",
        pt: "Cardapio Digital"
    },
    "nav.published": {
        es: "Publicados",
        en: "Published",
        pt: "Publicados"
    },
    "nav.metrics": {
        es: "Métricas Pro",
        en: "Pro Metrics",
        pt: "Métricas Pro"
    },
    "nav.hub": {
        es: "Hub",
        en: "Hub",
        pt: "Hub"
    },
    "nav.settings": {
        es: "Configuración",
        en: "Settings",
        pt: "Configurações"
    },
    "nav.login": {
        es: "Iniciar Sesión",
        en: "Login",
        pt: "Entrar"
    },
    "nav.create_account": {
        es: "Crear Cuenta",
        en: "Create Account",
        pt: "Criar Conta"
    },
    "nav.start_now": {
        es: "Comenzar Ahora",
        en: "Start Now",
        pt: "Começar Agora"
    },
    "nav.features": {
        es: "Características",
        en: "Features",
        pt: "Recursos"
    },
    "nav.pricing": {
        es: "Precios",
        en: "Pricing",
        pt: "Preços"
    },
    "nav.testimonials": {
        es: "Testimonios",
        en: "Testimonials",
        pt: "Depoimentos"
    },
    "nav.logout": {
        es: "Cerrar Sesión",
        en: "Logout",
        pt: "Sair"
    },
    // Settings
    "settings.title": {
        es: "CONFIGURACIÓN",
        en: "SETTINGS",
        pt: "CONFIGURAÇÕES"
    },
    "settings.subtitle": {
        es: "Personaliza tu experiencia, gestiona tu suscripción y asegura tu cuenta.",
        en: "Personalize your experience, manage your subscription and secure your account.",
        pt: "Personalize sua experiência, gerencie sua assinatura e proteja sua conta."
    },
    "settings.logout": {
        es: "Cerrar Sesión",
        en: "Log Out",
        pt: "Sair"
    },
    "settings.save": {
        es: "Confirmar Cambios",
        en: "Confirm Changes",
        pt: "Confirmar AlteraÃƒÂ§ÃƒÂµes"
    },
    "settings.saving": {
        es: "Procesando...",
        en: "Processing...",
        pt: "Processando..."
    },
    "settings.success": {
        es: "¡Configuración guardada correctamente!",
        en: "Settings saved successfully!",
        pt: "Configurações salvas com sucesso!"
    },
    "settings.error": {
        es: "Error al guardar los cambios",
        en: "Error saving changes",
        pt: "Erro ao salvar as alteraÃƒÂ§ÃƒÂµes"
    },
    "settings.validation.website": {
        es: "El sitio web debe comenzar con http:// o https://",
        en: "Website must start with http:// or https://",
        pt: "O site deve comeÃƒÂ§ar com http:// ou https://"
    },
    "settings.validation.name": {
        es: "El nombre es demasiado corto",
        en: "Name is too short",
        pt: "O nome ÃƒÂ© muito curto"
    },
    "settings.loading": {
        es: "PREPARANDO AJUSTES",
        en: "PREPARING SETTINGS",
        pt: "PREPARANDO AJUSTES"
    },
    "settings.syncing": {
        es: "Sincronizando con la nube...",
        en: "Syncing with the cloud...",
        pt: "Sincronizando com a nuvem..."
    },
    "settings.tabs.profile": {
        es: "Perfil Público",
        en: "Public Profile",
        pt: "Perfil Público"
    },
    "settings.tabs.profile.desc": {
        es: "Tu identidad en la plataforma",
        en: "Your identity on the platform",
        pt: "Sua identidade na plataforma"
    },
    "settings.tabs.account": {
        es: "Cuenta",
        en: "Account",
        pt: "Conta"
    },
    "settings.tabs.account.desc": {
        es: "Información de contacto y acceso",
        en: "Contact and access info",
        pt: "Informações de contato e acesso"
    },
    "settings.tabs.plan": {
        es: "Suscripción",
        en: "Subscription",
        pt: "Assinatura"
    },
    "settings.tabs.plan.desc": {
        es: "Gestiona tu plan y facturación",
        en: "Manage plan and billing",
        pt: "Gerenciar plano e faturamento"
    },
    "settings.tabs.security": {
        es: "Seguridad",
        en: "Security",
        pt: "SeguranÃƒÂ§a"
    },
    "settings.tabs.security.desc": {
        es: "Protege tu cuenta y datos",
        en: "Protect your account and data",
        pt: "Proteja sua conta e dados"
    },
    "settings.profile.visual": {
        es: "Identidad Visual",
        en: "Visual Identity",
        pt: "Identidade Visual"
    },
    "settings.profile.title": {
        es: "Tu Perfil Público",
        en: "Your Public Profile",
        pt: "Seu Perfil Público"
    },
    "settings.profile.desc": {
        es: "Esta información aparecerá en tus sitios publicados.",
        en: "This info will appear on your published sites.",
        pt: "Estas informações aparecerão em seus sites publicados."
    },
    "settings.profile.name": {
        es: "Nombre Completo",
        en: "Full Name",
        pt: "Nome Completo"
    },
    "settings.profile.company": {
        es: "Empresa o Negocio",
        en: "Company or Business",
        pt: "Empresa ou NegÃƒÂ³cio"
    },
    "settings.profile.website": {
        es: "Sitio Web Personal",
        en: "Personal Website",
        pt: "Site Pessoal"
    },
    "settings.profile.location": {
        es: "UbicaciÃƒÂ³n / DirecciÃƒÂ³n",
        en: "Location / Address",
        pt: "LocalizaÃƒÂ§ÃƒÂ£o / EndereÃƒÂ§o"
    },
    "settings.profile.bio": {
        es: "BiografÃƒÂ­a Profesional",
        en: "Professional Bio",
        pt: "Biografia Profissional"
    },
    "settings.account.title": {
        es: "Configuración de Acceso",
        en: "Access Settings",
        pt: "Configurações de Acesso"
    },
    "settings.account.desc": {
        es: "Gestiona cómo te contactamos y preferencias.",
        en: "Manage how we contact you and preferences.",
        pt: "Gerencie como entramos em contato e preferências."
    },
    "settings.account.email": {
        es: "Correo Electrónico",
        en: "Email Address",
        pt: "E-mail"
    },
    "settings.account.phone": {
        es: "Número de Contacto",
        en: "Contact Number",
        pt: "Número de Contato"
    },
    "settings.account.language": {
        es: "Idioma de Preferencia",
        en: "Preferred Language",
        pt: "Idioma de Preferência"
    },
    "settings.account.notifications": {
        es: "Notificaciones",
        en: "Notifications",
        pt: "NotificaÃƒÂ§ÃƒÂµes"
    },
    "settings.plan.title": {
        es: "Membresía",
        en: "Membership",
        pt: "Assinatura"
    },
    "settings.plan.current": {
        es: "Plan Actual",
        en: "Current Plan",
        pt: "Plano Atual"
    },
    "settings.plan.manage": {
        es: "Gestionar Pago",
        en: "Manage Payment",
        pt: "Gerenciar Pagamento"
    },
    "settings.security.title": {
        es: "Ciberseguridad",
        en: "Cybersecurity",
        pt: "Cibersegurança"
    },
    "settings.security.2fa_email": {
        es: "Verificación por Email",
        en: "Email Verification",
        pt: "Verificação por E-mail"
    },
    "settings.security.2fa_sms": {
        es: "Autenticación SMS",
        en: "SMS Authentication",
        pt: "Autenticação por SMS"
    },
    "settings.security.change_pass": {
        es: "Cambiar Contraseña",
        en: "Change Password",
        pt: "Alterar Senha"
    },
    "settings.security.delete_account": {
        es: "Eliminar Cuenta",
        en: "Delete Account",
        pt: "Excluir Conta"
    },
    // Hero
    "hero.tag": {
        es: "EdiciÃƒÂ³n Deluxe v2.0",
        en: "Deluxe Edition v2.0",
        pt: "EdiÃƒÂ§ÃƒÂ£o Deluxe v2.0"
    },
    "hero.title_start": {
        es: "Crea y Clona",
        en: "Create & Clone",
        pt: "Crie e Clone"
    },
    "hero.title_highlight": {
        es: "Landing Pages",
        en: "Landing Pages",
        pt: "Landing Pages"
    },
    "hero.subtitle_start": {
        es: "Deja de perder tiempo.",
        en: "Stop wasting time.",
        pt: "Pare de perder tempo."
    },
    "hero.subtitle_highlight": {
        es: "Crea pÃƒÂ¡ginas que venden",
        en: "Create pages that sell",
        pt: "Crie pÃƒÂ¡ginas que vendem"
    },
    "hero.subtitle_end_1": {
        es: "o clona el ÃƒÂ©xito de tu competencia en segundos.",
        en: "or clone your competition's success in seconds.",
        pt: "ou clone o sucesso da sua concorrÃƒÂªncia em segundos."
    },
    "hero.subtitle_end_highlight": {
        es: "Sin cÃƒÂ³digo, resultados profesionales al instante.",
        en: "No code, professional results instantly.",
        pt: "Sem cÃƒÂ³digo, resultados profissionais instantaneamente."
    },
    "hero.cta_create": {
        es: "Crear Landing",
        en: "Create Landing",
        pt: "Criar Landing"
    },
    "hero.cta_clone": {
        es: "Clonar PÃƒÂ¡gina",
        en: "Clone Page",
        pt: "Clonar PÃƒÂ¡gina"
    },
    "hero.payments": {
        es: "MÃƒÂ©todos de Pago",
        en: "Payment Methods",
        pt: "MÃƒÂ©todos de Pagamento"
    },
    "testimonials.title": {
        es: "Lo que dicen nuestros usuarios",
        en: "What our users say",
        pt: "O que nossos usuÃƒÂ¡rios dizem"
    },
    "testimonials.subtitle": {
        es: "ÃƒÅ¡nete a cientos de creadores que ya estÃƒÂ¡n construyendo el futuro de la web.",
        en: "Join hundreds of creators who are already building the future of the web.",
        pt: "Junte-se a centenas de criadores que jÃƒÂ¡ estÃƒÂ£o construindo o futuro da web."
    },
    "testimonials.pedro.role": {
        es: "COPYWRITER",
        en: "COPYWRITER",
        pt: "COPYWRITER"
    },
    "testimonials.pedro.text": {
        es: "La mejor inversiÃƒÂ³n para mi agencia. Puedo validar copys en diseÃƒÂ±os reales al instante.",
        en: "The best investment for my agency. I can validate copy in real designs instantly.",
        pt: "O melhor investimento para minha agÃƒÂªncia. Posso validar copys en designs reais instantaneamente."
    },
    "testimonials.ana.role": {
        es: "DIRECTORA DE MARKETING",
        en: "MARKETING DIRECTOR",
        pt: "DIRETORA DE MARKETING"
    },
    "testimonials.ana.text": {
        es: "La velocidad de carga y la facilidad de uso son incomparables. AumentÃƒÂ³ mi conversiÃƒÂ³n un 40%.",
        en: "Load speed and ease of use are incomparable. Increased my conversion by 40%.",
        pt: "A velocidade de carregamento e a facilidade de uso sÃƒÂ£o incomparÃƒÂ¡veis. Aumentou minha conversÃƒÂ£o em 40%."
    },
    "testimonials.carlos.role": {
        es: "FREELANCER",
        en: "FREELANCER",
        pt: "FREELANCER"
    },
    "testimonials.carlos.text": {
        es: "Pude clonar la landing de mi competencia y mejorarla en minutos. Ã‚Â¡IncreÃƒÂ­ble herramienta!",
        en: "I was able to clone my competitor's landing page and improve it in minutes. Amazing tool!",
        pt: "Consegui clonar a landing da minha concorrÃƒÂªncia e melhorÃƒÂ¡-la em minutos. Ferramenta incrÃƒÂ­vel!"
    },
    "testimonials.sofia.role": {
        es: "DISEÃƒâ€˜ADORA UX",
        en: "UX DESIGNER",
        pt: "DESIGNER UX"
    },
    "testimonials.sofia.text": {
        es: "La flexibilidad del editor me permite crear experiencias ÃƒÂºnicas sin tocar cÃƒÂ³digo.",
        en: "The editor's flexibility allows me to create unique experiences without touching code.",
        pt: "A flexibilidade do editor me permite criar experiÃƒÂªncias ÃƒÂºnicas sem tocar em cÃƒÂ³digo."
    },
    "testimonials.diego.role": {
        es: "EMPRENDEDOR",
        en: "ENTREPRENEUR",
        pt: "EMPREENDEDOR"
    },
    "testimonials.diego.text": {
        es: "LancÃƒÂ© mi MVP en un fin de semana gracias a Fast Page. Los inversores quedaron impresionados.",
        en: "I launched my MVP in a weekend thanks to Fast Page. Investors were impressed.",
        pt: "Lancei meu MVP em um fim de semana graÃƒÂ§as ÃƒÂ  Fast Page. Os investidores ficaram impressionados."
    },
    "testimonials.laura.role": {
        es: "BLOGGER",
        en: "BLOGGER",
        pt: "BLOGGER"
    },
    "testimonials.laura.text": {
        es: "Mis lectores adoran el nuevo diseÃƒÂ±o de mi blog. Fue tan fÃƒÂ¡cil como elegir una plantilla.",
        en: "My readers love my blog's new design. It was as easy as choosing a template.",
        pt: "Meus leitores adoram o novo design do meu blog. Foi tÃƒÂ£o fÃƒÂ¡cil quanto escolher um modelo."
    },
    "testimonials.javier.role": {
        es: "CONSULTOR SEO",
        en: "SEO CONSULTANT",
        pt: "CONSULTOR SEO"
    },
    "testimonials.javier.text": {
        es: "El cÃƒÂ³digo generado es limpio y rÃƒÂ¡pido, lo que ha mejorado enormemente mi ranking en Google.",
        en: "The generated code is clean and fast, which has greatly improved my Google ranking.",
        pt: "O cÃƒÂ³digo gerado ÃƒÂ© limpo e rÃƒÂ¡pido, o que melhorou enormemente meu ranking no Google."
    },
    "testimonials.elena.role": {
        es: "PROJECT MANAGER",
        en: "PROJECT MANAGER",
        pt: "GERENTE DE PROJETO"
    },
    "testimonials.elena.text": {
        es: "Gestionar mÃƒÂºltiples proyectos nunca fue tan sencillo. Fast Page es mi herramienta diaria.",
        en: "Managing multiple projects has never been easier. Fast Page is my daily tool.",
        pt: "Gerenciar mÃƒÂºltiplos projetos nunca foi tÃƒÂ£o simples. Fast Page ÃƒÂ© minha ferramenta diÃƒÂ¡ria."
    },
    "testimonials.miguel.role": {
        es: "DESARROLLADOR",
        en: "DEVELOPER",
        pt: "DESENVOLVEDOR"
    },
    "testimonials.miguel.text": {
        es: "Aunque sÃƒÂ© programar, esto me ahorra horas de trabajo repetitivo. Ã‚Â¡Simplemente genial!",
        en: "Even though I know how to code, this saves me hours of repetitive work. Simply great!",
        pt: "Embora eu saiba programar, isso me poupa horas de trabalho repetitivo. Simplesmente genial!"
    },
    "testimonials.carmen.role": {
        es: "AGENCIA DIGITAL",
        en: "DIGITAL AGENCY",
        pt: "AGÃƒÅ NCIA DIGITAL"
    },
    "testimonials.carmen.text": {
        es: "Hemos escalado nuestra producciÃƒÂ³n de landings x10 sin contratar mÃƒÂ¡s personal.",
        en: "We have scaled our landing page production x10 without hiring more staff.",
        pt: "Escalamos nossa produÃƒÂ§ÃƒÂ£o de landings em 10x sem contratar mais pessoal."
    },
    // Cloner Business Models
    "cloner.title": {
        es: "Selecciona tu Modelo de Negocio",
        en: "Select Your Business Model",
        pt: "Selecione seu Modelo de NegÃƒÂ³cio"
    },
    "cloner.subtitle": {
        es: "Elige una plantilla base optimizada para tu industria.",
        en: "Choose a base template optimized for your industry.",
        pt: "Escolha um modelo base otimizado para sua indÃƒÂºstria."
    },
    "cloner.restaurant.title": {
        es: "Restaurante",
        en: "Restaurant",
        pt: "Restaurante"
    },
    "cloner.restaurant.desc": {
        es: "MenÃƒÂºs digitales, reservas y pedidos online. DiseÃƒÂ±o apetitoso.",
        en: "Digital menus, reservations, and online orders. Appetizing design.",
        pt: "Menus digitais, reservas e pedidos online. Design apetitoso."
    },
    "cloner.tech.title": {
        es: "TecnologÃƒÂ­a",
        en: "Technology",
        pt: "Tecnologia"
    },
    "cloner.tech.desc": {
        es: "SaaS, Apps y Startups. Moderno, limpio y futurista.",
        en: "SaaS, Apps, and Startups. Modern, clean, and futuristic.",
        pt: "SaaS, Apps e Startups. Moderno, limpo e futurista."
    },
    "cloner.office.title": {
        es: "Oficina / Corporativo",
        en: "Office / Corporate",
        pt: "EscritÃƒÂ³rio / Corporativo"
    },
    "cloner.office.desc": {
        es: "ConsultorÃƒÂ­a, legal y servicios. Profesional y confiable.",
        en: "Consulting, legal, and services. Professional and reliable.",
        pt: "ConsultorÃ¯Â¿Â½a, jurÃƒÂ­dico e serviÃƒÂ§os. Profissional e confiÃƒÂ¡vel."
    },
    "cloner.select": {
        es: "Seleccionar Modelo",
        en: "Select Model",
        pt: "Selecionar Modelo"
    },
    "cloner.back": {
        es: "Volver a Modelos",
        en: "Back to Models",
        pt: "Voltar para Modelos"
    },
    // Cloner Subcategories
    "cloner.restaurant.pizzeria": {
        es: "PizzerÃƒÂ­a",
        en: "Pizzeria",
        pt: "Pizzaria"
    },
    "cloner.restaurant.criolla": {
        es: "Comida Criolla",
        en: "Creole Food",
        pt: "Comida Crioula"
    },
    "cloner.restaurant.china": {
        es: "Comida China",
        en: "Chinese Food",
        pt: "Comida Chinesa"
    },
    "cloner.restaurant.anticuchos": {
        es: "Anticuchos",
        en: "Anticuchos",
        pt: "Anticuchos"
    },
    "cloner.restaurant.sushi": {
        es: "Sushi / Japonesa",
        en: "Sushi / Japanese",
        pt: "Sushi / Japonesa"
    },
    "cloner.restaurant.cafe": {
        es: "CafeterÃƒÂ­a",
        en: "Coffee Shop",
        pt: "Cafeteria"
    },
    "cloner.tech.saas": {
        es: "SaaS / Software",
        en: "SaaS / Software",
        pt: "SaaS / Software"
    },
    "cloner.tech.app": {
        es: "App Mobile",
        en: "Mobile App",
        pt: "App Mobile"
    },
    "cloner.tech.agency": {
        es: "Agencia Digital",
        en: "Digital Agency",
        pt: "AgÃƒÂªncia Digital"
    },
    "cloner.tech.startup": {
        es: "Startup",
        en: "Startup",
        pt: "Startup"
    },
    "cloner.office.realestate": {
        es: "Inmobiliaria",
        en: "Real Estate",
        pt: "ImobiliÃƒÂ¡ria"
    },
    "cloner.office.law": {
        es: "Abogados",
        en: "Law Firm",
        pt: "Advogados"
    },
    "cloner.office.consulting": {
        es: "ConsultorÃƒÂ­a",
        en: "Consulting",
        pt: "ConsultorÃƒÂ­a"
    },
    "cloner.office.medical": {
        es: "ClÃƒÂ­nica / MÃƒÂ©dica",
        en: "Clinic / Medical",
        pt: "ClÃƒÂ­nica / MÃƒÂ©dica"
    },
    // New Models
    "cloner.beauty.title": {
        es: "Salud y Belleza",
        en: "Health & Beauty",
        pt: "SaÃƒÂºde e Beleza"
    },
    "cloner.beauty.desc": {
        es: "Spas, gimnasios y bienestar. Relajante y vital.",
        en: "Spas, gyms, and wellness. Relaxing and vital.",
        pt: "Spas, academias e bem-estar. Relaxante e vital."
    },
    "cloner.education.title": {
        es: "EducaciÃƒÂ³n",
        en: "Education",
        pt: "EducaÃƒÂ§ÃƒÂ£o"
    },
    "cloner.education.desc": {
        es: "Cursos, academias y tutores. Educativo y claro.",
        en: "Courses, academies, and tutors. Educational and clear.",
        pt: "Cursos, academias e tutores. Educativo e claro."
    },
    "cloner.ecommerce.title": {
        es: "E-commerce",
        en: "E-commerce",
        pt: "E-commerce"
    },
    "cloner.ecommerce.desc": {
        es: "Tiendas online y catÃƒÂ¡logos. Ventas directas.",
        en: "Online stores and catalogs. Direct sales.",
        pt: "Lojas online e catÃƒÂ¡logos. Vendas diretas."
    },
    "cloner.services.title": {
        es: "Oficios / Servicios",
        en: "Trades / Services",
        pt: "OfÃƒÂ­cios / ServiÃƒÂ§os"
    },
    "cloner.services.desc": {
        es: "TÃƒÂ©cnicos, hogar y reparaciones. PrÃƒÂ¡ctico.",
        en: "Technicians, home, and repairs. Practical.",
        pt: "TÃƒÂ©cnicos, casa e reparos. PrÃƒÂ¡tico."
    },
    "cloner.creative.title": {
        es: "Creativo / Eventos",
        en: "Creative / Events",
        pt: "Criativo / Eventos"
    },
    "cloner.creative.desc": {
        es: "Portafolios, mÃƒÂºsica y bodas. ArtÃƒÂ­stico.",
        en: "Portfolios, music, and weddings. Artistic.",
        pt: "PortfÃƒÂ³lios, mÃƒÂºsica e casamentos. ArtÃƒÂ­stico."
    },
    // New Subcategories
    "cloner.beauty.spa": {
        es: "Spa / EstÃƒÂ©tica",
        en: "Spa / Aesthetics",
        pt: "Spa / EstÃƒÂ©tica"
    },
    "cloner.beauty.gym": {
        es: "Gimnasio / Crossfit",
        en: "Gym / Crossfit",
        pt: "Academia / Crossfit"
    },
    "cloner.beauty.yoga": {
        es: "Yoga / Pilates",
        en: "Yoga / Pilates",
        pt: "Yoga / Pilates"
    },
    "cloner.beauty.barber": {
        es: "BarberÃƒÂ­a / SalÃƒÂ³n",
        en: "Barber / Salon",
        pt: "Barbearia / SalÃƒÂ£o"
    },
    "cloner.education.course": {
        es: "Curso Online",
        en: "Online Course",
        pt: "Curso Online"
    },
    "cloner.education.school": {
        es: "Colegio / Nido",
        en: "School / Kindergarten",
        pt: "Escola / Jardim de InfÃƒÂ¢ncia"
    },
    "cloner.education.tutor": {
        es: "Profesor Particular",
        en: "Private Tutor",
        pt: "Professor Particular"
    },
    "cloner.education.language": {
        es: "Idiomas",
        en: "Languages",
        pt: "Idiomas"
    },
    "cloner.ecommerce.fashion": {
        es: "Moda / Ropa",
        en: "Fashion / Clothing",
        pt: "Moda / Roupa"
    },
    "cloner.ecommerce.tech": {
        es: "TecnologÃƒÂ­a",
        en: "Technology",
        pt: "Tecnologia"
    },
    "cloner.ecommerce.pets": {
        es: "Mascotas",
        en: "Pets",
        pt: "Pets"
    },
    "cloner.ecommerce.home": {
        es: "Hogar y Deco",
        en: "Home & Decor",
        pt: "Casa e DecoraÃƒÂ§ÃƒÂ£o"
    },
    "cloner.services.plumber": {
        es: "Gasfitero / Plomero",
        en: "Plumber",
        pt: "Encanador"
    },
    "cloner.services.electrician": {
        es: "Electricista",
        en: "Electrician",
        pt: "Eletricista"
    },
    "cloner.services.cleaning": {
        es: "Limpieza",
        en: "Cleaning",
        pt: "Limpeza"
    },
    "cloner.services.mechanic": {
        es: "MecÃƒÂ¡nico",
        en: "Mechanic",
        pt: "MecÃƒÂ¢nico"
    },
    "cloner.creative.photography": {
        es: "FotografÃƒÂ­a",
        en: "Photography",
        pt: "Fotografia"
    },
    "cloner.creative.music": {
        es: "MÃƒÂºsica / DJ",
        en: "Music / DJ",
        pt: "MÃƒÂºsica / DJ"
    },
    "cloner.creative.wedding": {
        es: "Wedding Planner",
        en: "Wedding Planner",
        pt: "Wedding Planner"
    },
    "cloner.creative.portfolio": {
        es: "Portafolio Personal",
        en: "Personal Portfolio",
        pt: "PortfÃƒÂ³lio Pessoal"
    },
    // Hub
    "hub.welcome": {
        es: "Bienvenido de nuevo,",
        en: "Welcome back,",
        pt: "Bem-vindo de volta,"
    },
    "hub.subtitle": {
        es: "Tu centro de control creativo.",
        en: "Your creative command center.",
        pt: "Seu centro de controle criativo."
    },
    "hub.builder.title": {
        es: "Constructor",
        en: "Builder",
        pt: "Construtor"
    },
    "hub.builder.desc": {
        es: "Crea landing pages desde cero con nuestro editor visual arrastrar y soltar.",
        en: "Create landing pages from scratch with our drag and drop visual editor.",
        pt: "Crie landing pages do zero com nosso editor visual de arrastar e soltar."
    },
    "hub.builder.action": {
        es: "Abrir Constructor",
        en: "Open Builder",
        pt: "Abrir Construtor"
    },
    "hub.cloner.title": {
        es: "Plantillas Web",
        en: "Web Templates",
        pt: "Modelos Web"
    },
    "hub.cloner.desc": {
        es: "Personaliza tu pÃƒÂ¡gina web",
        en: "Customize your web page",
        pt: "Personalize sua pÃƒÂ¡gina web"
    },
    "hub.cloner.action": {
        es: "Abrir Plantillas",
        en: "Open Templates",
        pt: "Abrir Modelos"
    },
    "hub.webcloner.title": {
        es: "Clonador Web",
        en: "Web Cloner",
        pt: "Clonador Web"
    },
    "hub.webcloner.desc": {
        es: "Replica cualquier sitio web en segundos y hazlo tuyo.",
        en: "Replicate any website in seconds and make it yours.",
        pt: "Replique qualquer site em segundos e torne-o seu."
    },
    "hub.webcloner.action": {
        es: "Abrir Clonador",
        en: "Open Cloner",
        pt: "Abrir Clonador"
    },
    "hub.store.title": {
        es: "Creador de Tiendas Online",
        en: "Online Store Builder",
        pt: "Criador de Lojas Online"
    },
    "hub.store.desc": {
        es: "Crea una tienda ecommerce profesional con productos, carrito y checkout, lista para publicar.",
        en: "Create a professional ecommerce store with products, cart and checkout, ready to publish.",
        pt: "Crie uma loja ecommerce profissional com produtos, carrinho e checkout, pronta para publicar."
    },
    "hub.store.action": {
        es: "Crear Tienda",
        en: "Create Store",
        pt: "Criar Loja"
    },
    "hub.linkhub.title": {
        es: "Carta Digital",
        en: "Digital Menu",
        pt: "Cardapio Digital"
    },
    "hub.linkhub.desc": {
        es: "Crea tu Carta Digital con contacto, carta/catalogo y ubicacion en una URL lista para compartir.",
        en: "Build your Digital Menu with contact, menu/catalog and location in one shareable URL.",
        pt: "Crie seu Cardapio Digital com contato, cardapio/catalogo e localizacao em uma URL para compartilhar."
    },
    "hub.linkhub.action": {
        es: "Abrir Carta Digital",
        en: "Open Digital Menu",
        pt: "Abrir Cardapio Digital"
    },
    "hub.published.title": {
        es: "Proyectos Publicados",
        en: "Published Projects",
        pt: "Projetos Publicados"
    },
    "hub.published.desc": {
        es: "Gestiona todos tus proyectos publicados en una sola vista profesional.",
        en: "Manage all your published projects in one professional view.",
        pt: "Gerencie todos os seus projetos publicados em uma unica visao profissional."
    },
    "hub.published.action": {
        es: "Ver Publicados",
        en: "View Published",
        pt: "Ver Publicados"
    },
    "hub.metrics.title": {
        es: "MÃƒÂ©tricas Pro",
        en: "Pro Metrics",
        pt: "MÃƒÂ©tricas Pro"
    },
    "hub.metrics.desc": {
        es: "AnalÃƒÂ­ticas avanzadas y mapas de calor para optimizar conversiones.",
        en: "Advanced analytics and heatmaps to optimize conversions.",
        pt: "AnÃƒÂ¡lises avanÃƒÂ§adas e mapas de calor para otimizar conversÃƒÂµes."
    },
    "hub.metrics.action": {
        es: "Ver AnalÃƒÂ­ticas",
        en: "View Analytics",
        pt: "Ver AnÃƒÂ¡lises"
    },
    "hub.config.title": {
        es: "Configuración",
        en: "Configuration",
        pt: "Configurações"
    },
    "hub.config.desc": {
        es: "Administra tu cuenta, plan y preferencias globales.",
        en: "Manage your account, plan and global preferences.",
        pt: "Gerencie sua conta, plano e preferÃƒÂªncias globais."
    },
    "hub.config.action": {
        es: "Ir a Ajustes",
        en: "Go to Settings",
        pt: "Ir para Ajustes"
    },
    "hub.logout": {
        es: "Cerrar SesiÃƒÂ³n",
        en: "Log Out",
        pt: "Sair"
    },
    // FAQ
    "faq.title": {
        es: "Preguntas Frecuentes",
        en: "Frequently Asked Questions",
        pt: "Perguntas Frequentes"
    },
    "faq.subtitle": {
        es: "Resolvemos tus dudas antes de empezar.",
        en: "We answer your questions before you start.",
        pt: "Resolvemos suas dÃƒÂºvidas antes de comeÃƒÂ§ar."
    },
    "faq.q1": {
        es: "Ã‚Â¿Es necesario saber programar?",
        en: "Do I need to know how to code?",
        pt: "Ãƒâ€° necessÃƒÂ¡rio saber programar?"
    },
    "faq.a1": {
        es: "No, nuestra plataforma es completamente No-Code con una interfaz de arrastrar y soltar.",
        en: "No, our platform is completely No-Code with a drag-and-drop interface.",
        pt: "NÃƒÂ£o, nossa plataforma ÃƒÂ© completamente No-Code com uma interface de arrastar e soltar."
    },
    "faq.q2": {
        es: "Ã‚Â¿Puedo exportar el cÃƒÂ³digo?",
        en: "Can I export the code?",
        pt: "Posso exportar o cÃƒÂ³digo?"
    },
    "faq.a2": {
        es: "SÃƒÂ­, puedes exportar tus creaciones a HTML/CSS/JS limpio o componentes React.",
        en: "Yes, you can export your creations to clean HTML/CSS/JS or React components.",
        pt: "Sim, vocÃƒÂª pode exportar suas criaÃƒÂ§ÃƒÂµes para HTML/CSS/JS limpo ou componentes React."
    },
    "faq.q3": {
        es: "Ã‚Â¿Funciona en mÃƒÂ³viles?",
        en: "Does it work on mobile?",
        pt: "Funciona em celulares?"
    },
    "faq.a3": {
        es: "Absolutamente. Toda la plataforma y las pÃƒÂ¡ginas generadas siguen la filosofÃƒÂ­a Mobile First.",
        en: "Absolutely. The entire platform and generated pages follow the Mobile First philosophy.",
        pt: "Absolutamente. Toda a plataforma e as pÃƒÂ¡ginas geradas seguem a filosofia Mobile First."
    },
    "faq.q4": {
        es: "Ã‚Â¿Hay lÃƒÂ­mite de pÃƒÂ¡ginas?",
        en: "Is there a page limit?",
        pt: "Existe limite de pÃƒÂ¡ginas?"
    },
    "faq.a4": {
        es: "Depende de tu plan. El plan gratuito incluye 3 proyectos, y los planes Pro son ilimitados.",
        en: "It depends on your plan. The free plan includes 3 projects, and Pro plans are unlimited.",
        pt: "Depende do seu plano. O plano gratuito inclui 3 projetos, e os planos Pro sÃƒÂ£o ilimitados."
    },
    "faq.q5": {
        es: "Ã‚Â¿QuÃƒÂ© tecnologÃƒÂ­as usa?",
        en: "What technologies does it use?",
        pt: "Quais tecnologias utiliza?"
    },
    "faq.a5": {
        es: "El builder genera cÃƒÂ³digo moderno optimizado usando Next.js 14, Tailwind CSS y React.",
        en: "The builder generates optimized modern code using Next.js 14, Tailwind CSS, and React.",
        pt: "O builder gera cÃƒÂ³digo moderno otimizado usando Next.js 14, Tailwind CSS e React."
    },
    // General
    // Landing Extended
    "landing.schema.description": {
        es: "Crea, clona y publica landing pages profesionales en minutos con editor visual.",
        en: "Create, clone, and publish professional landing pages in minutes with a visual editor.",
        pt: "Crie, clone e publique landing pages profissionais em minutos com editor visual."
    },
    "landing.proof.eyebrow": {
        es: "Prueba y rendimiento",
        en: "Proof and performance",
        pt: "Prova e performance"
    },
    "landing.proof.title": {
        es: "DiseÃƒÂ±ada para convertir visitas en clientes",
        en: "Built to turn visitors into customers",
        pt: "Projetada para converter visitas em clientes"
    },
    "landing.proof.subtitle": {
        es: "Constructor visual, clonado inteligente y publicaciÃƒÂ³n inmediata. Todo en un flujo corto para lanzar mÃƒÂ¡s rÃƒÂ¡pido y vender mejor.",
        en: "Visual builder, smart cloning, and instant publishing. Everything in a short flow to launch faster and sell better.",
        pt: "Construtor visual, clonagem inteligente e publicacao imediata. Tudo em um fluxo curto para lancar mais rapido e vender melhor."
    },
    "landing.proof.stat1": {
        es: "pÃƒÂ¡ginas publicadas",
        en: "published pages",
        pt: "pÃƒÂ¡ginas publicadas"
    },
    "landing.proof.stat2": {
        es: "proyectos activos",
        en: "active projects",
        pt: "projetos ativos"
    },
    "landing.proof.stat3": {
        es: "satisfacciÃƒÂ³n promedio",
        en: "average satisfaction",
        pt: "satisfacao media"
    },
    "landing.proof.stat4": {
        es: "tiempo para publicar",
        en: "time to publish",
        pt: "tempo para publicar"
    },
    "landing.proof.card1.title": {
        es: "Sin cÃƒÂ³digo y editable al 100%",
        en: "No-code and 100% editable",
        pt: "Sem codigo e 100% editavel"
    },
    "landing.proof.card1.desc": {
        es: "Cambia textos, imÃƒÂ¡genes, colores y estructura visual sin depender de desarrollo.",
        en: "Change text, images, colors, and visual structure without relying on development.",
        pt: "Altere textos, imagens, cores e estrutura visual sem depender de desenvolvimento."
    },
    "landing.proof.card2.title": {
        es: "PublicaciÃƒÂ³n y guardado real",
        en: "Real publish and save",
        pt: "Publicacao e salvamento reais"
    },
    "landing.proof.card2.desc": {
        es: "Guarda versiones, publica y vuelve a tu cuenta con historial persistente.",
        en: "Save versions, publish, and return to your account with persistent history.",
        pt: "Salve versoes, publique e volte para sua conta com historico persistente."
    },
    "landing.product.eyebrow": {
        es: "Vista rÃƒÂ¡pida del producto",
        en: "Quick product view",
        pt: "Visao rapida do produto"
    },
    "landing.product.title": {
        es: "Elige el mejor camino para cada campaÃƒÂ±a",
        en: "Choose the best path for each campaign",
        pt: "Escolha o melhor caminho para cada campanha"
    },
    "landing.product.templates.title": {
        es: "Plantillas (rÃƒÂ¡pido)",
        en: "Templates (fast)",
        pt: "Modelos (rapido)"
    },
    "landing.product.templates.desc": {
        es: "Empieza desde modelos por nicho y edita todo visualmente.",
        en: "Start from niche templates and edit everything visually.",
        pt: "Comece com modelos por nicho e edite tudo visualmente."
    },
    "landing.product.templates.b1": {
        es: "Listo en minutos",
        en: "Ready in minutes",
        pt: "Pronto em minutos"
    },
    "landing.product.templates.b2": {
        es: "Ideal para lanzamientos rÃƒÂ¡pidos",
        en: "Ideal for fast launches",
        pt: "Ideal para lancamentos rapidos"
    },
    "landing.product.templates.b3": {
        es: "DiseÃƒÂ±o base profesional",
        en: "Professional base design",
        pt: "Design base profissional"
    },
    "landing.product.templates.cta": {
        es: "Ver Plantillas",
        en: "See Templates",
        pt: "Ver Modelos"
    },
    "landing.product.cloner.title": {
        es: "Clonador Web (control total)",
        en: "Web Cloner (full control)",
        pt: "Clonador Web (controle total)"
    },
    "landing.product.cloner.desc": {
        es: "Replica, adapta y optimiza una pÃƒÂ¡gina existente para tu oferta.",
        en: "Replicate, adapt, and optimize an existing page for your offer.",
        pt: "Replique, adapte e otimize uma pagina existente para sua oferta."
    },
    "landing.product.cloner.b1": {
        es: "Ideal para benchmarking",
        en: "Ideal for benchmarking",
        pt: "Ideal para benchmarking"
    },
    "landing.product.cloner.b2": {
        es: "EdiciÃƒÂ³n completa de contenido",
        en: "Complete content editing",
        pt: "Edicao completa de conteudo"
    },
    "landing.product.cloner.b3": {
        es: "PublicaciÃƒÂ³n con seguimiento",
        en: "Publishing with tracking",
        pt: "Publicacao com acompanhamento"
    },
    "landing.product.cloner.cta": {
        es: "Ir al Clonador",
        en: "Go to Cloner",
        pt: "Ir para o Clonador"
    },
    "landing.useCases.title": {
        es: "Casos de uso listos para vender",
        en: "Use cases ready to sell",
        pt: "Casos de uso prontos para vender"
    },
    "landing.useCases.subtitle": {
        es: "DiseÃƒÂ±os pensados por tipo de negocio para acelerar resultados sin perder calidad visual.",
        en: "Designs tailored by business type to accelerate results without losing visual quality.",
        pt: "Designs pensados por tipo de negocio para acelerar resultados sem perder qualidade visual."
    },
    "landing.useCases.cta": {
        es: "Ver plantilla ideal",
        en: "See ideal template",
        pt: "Ver modelo ideal"
    },
    "landing.useCases.restaurant.title": {
        es: "Restaurantes",
        en: "Restaurants",
        pt: "Restaurantes"
    },
    "landing.useCases.restaurant.tag": {
        es: "alto ticket",
        en: "high ticket",
        pt: "alto ticket"
    },
    "landing.useCases.restaurant.desc": {
        es: "MenÃƒÂºs, reservas y pedidos en una sola pÃƒÂ¡gina.",
        en: "Menus, bookings, and orders on one page.",
        pt: "Menus, reservas e pedidos em uma unica pagina."
    },
    "landing.useCases.services.title": {
        es: "Servicios",
        en: "Services",
        pt: "Servicos"
    },
    "landing.useCases.services.tag": {
        es: "lead inmediato",
        en: "instant lead",
        pt: "lead imediato"
    },
    "landing.useCases.services.desc": {
        es: "Captura leads de alto valor con formularios claros.",
        en: "Capture high-value leads with clear forms.",
        pt: "Capture leads de alto valor com formularios claros."
    },
    "landing.useCases.ecommerce.title": {
        es: "E-commerce",
        en: "E-commerce",
        pt: "E-commerce"
    },
    "landing.useCases.ecommerce.tag": {
        es: "conversiÃƒÂ³n rÃƒÂ¡pida",
        en: "fast conversion",
        pt: "conversao rapida"
    },
    "landing.useCases.ecommerce.desc": {
        es: "Lanza ofertas y catÃƒÂ¡logos con diseÃƒÂ±o orientado a venta.",
        en: "Launch offers and catalogs with a sales-oriented design.",
        pt: "Lance ofertas e catalogos com design orientado para vendas."
    },
    "landing.useCases.consulting.title": {
        es: "ConsultorÃƒÂ­a",
        en: "Consulting",
        pt: "ConsultorÃƒÂ­a"
    },
    "landing.useCases.consulting.tag": {
        es: "marca premium",
        en: "premium brand",
        pt: "marca premium"
    },
    "landing.useCases.consulting.desc": {
        es: "Refuerza autoridad con casos y CTA de contacto directo.",
        en: "Build authority with case studies and direct-contact CTA.",
        pt: "Reforce autoridade com casos e CTA de contato direto."
    },
    "landing.mobile.stickyCta": {
        es: "Crear ahora y publicar",
        en: "Create now and publish",
        pt: "Criar agora e publicar"
    },
    // Shared UI
    "floating.scrollTop": {
        es: "Subir",
        en: "Scroll to top",
        pt: "Subir"
    },
    "floating.toggleLanguage": {
        es: "Cambiar idioma",
        en: "Change language",
        pt: "Mudar idioma"
    },
    "footer.description": {
        es: "Plataforma profesional para crear y clonar landing pages",
        en: "Professional platform to create and clone landing pages",
        pt: "Plataforma profissional para criar e clonar landing pages"
    },
    "footer.rights": {
        es: "Ã‚Â© {year} Fast Page. Todos los derechos reservados.",
        en: "Ã‚Â© {year} Fast Page. All rights reserved.",
        pt: "Ã‚Â© {year} Fast Page. Todos os direitos reservados."
    },
    loading: {
        es: "Cargando...",
        en: "Loading...",
        pt: "Carregando..."
    }
};
function LanguageProvider({ children }) {
    const [language, setLanguage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_LANGUAGE);
    const isSupportedLanguage = (value)=>value === "es" || value === "en" || value === "pt";
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const savedRaw = localStorage.getItem("language");
        if (savedRaw && isSupportedLanguage(savedRaw)) {
            setLanguage(savedRaw);
            return;
        }
        localStorage.setItem("language", DEFAULT_LANGUAGE);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        document.documentElement.lang = language;
    }, [
        language
    ]);
    const handleSetLanguage = (lang)=>{
        setLanguage(lang);
        localStorage.setItem("language", lang);
    };
    const t = (key)=>{
        const value = translations[key]?.[language] || key;
        return fixMojibake(value);
    };
    // Default language is English for the full platform and can be switched in one click.
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LanguageContext.Provider, {
        value: {
            language,
            setLanguage: handleSetLanguage,
            t
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/LanguageContext.tsx",
        lineNumber: 639,
        columnNumber: 5
    }, this);
}
function useLanguage() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
}),
"[project]/src/components/Nav.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Nav
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$LanguageContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/LanguageContext.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function Nav() {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    // Lo casteo a any para no pelear con el tipo exacto de tu contexto
    const langCtx = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$LanguageContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLanguage"]?.() ?? {};
    const language = langCtx.language ?? "es";
    const toggleLanguage = langCtx.toggleLanguage;
    const isAuth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>pathname?.startsWith("/auth"), [
        pathname
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "fixed top-0 left-0 right-0 z-50 px-4 py-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto flex w-full max-w-6xl items-center justify-between",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    href: "/",
                    className: "flex items-center gap-2",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: "/logo.png",
                        alt: "Logo",
                        className: "h-10 w-auto object-contain"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Nav.tsx",
                        lineNumber: 23,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/Nav.tsx",
                    lineNumber: 22,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>toggleLanguage?.(),
                            className: "rounded-full border border-white/20 bg-white/5 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-white/10",
                            "aria-label": "Cambiar idioma",
                            children: language === "es" ? "EN" : "ES"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Nav.tsx",
                            lineNumber: 33,
                            columnNumber: 11
                        }, this),
                        !isAuth && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/auth?tab=login",
                                    className: "text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 hover:text-white",
                                    children: "Login"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Nav.tsx",
                                    lineNumber: 45,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/auth?tab=register",
                                    className: "rounded-full bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:bg-white/20",
                                    children: "Create account"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Nav.tsx",
                                    lineNumber: 51,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Nav.tsx",
                    lineNumber: 31,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Nav.tsx",
            lineNumber: 20,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/Nav.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/providers/ThemeProvider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-themes/dist/index.mjs [app-ssr] (ecmascript)");
"use client";
;
;
function ThemeProvider({ children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThemeProvider"], {
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/providers/ThemeProvider.tsx",
        lineNumber: 10,
        columnNumber: 10
    }, this);
}
}),
"[project]/src/components/GuestSupportWidget.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GuestSupportWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-ssr] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/send.js [app-ssr] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-ssr] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$LanguageContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/LanguageContext.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
const BUSINESS_WHATSAPP = "51919662011";
const SUPPORT_FAQ = [
    {
        id: "plans",
        quickEs: "Planes y pagos",
        quickEn: "Plans and billing",
        questionEs: "Como activo mi plan y empiezo hoy?",
        questionEn: "How do I activate my plan and start today?",
        answerEs: "Elige Starter, Business o Pro en Billing, realiza el pago y se activa para publicar y vender.",
        answerEn: "Choose Starter, Business, or Pro in Billing, complete payment, and activate to publish and sell.",
        keywords: [
            "plan",
            "billing",
            "pago",
            "payment",
            "business",
            "pro",
            "starter"
        ]
    },
    {
        id: "speed",
        quickEs: "Lanzamiento rapido",
        quickEn: "Quick launch",
        questionEs: "En cuanto tiempo puedo lanzar mi pagina?",
        questionEn: "How fast can I launch my page?",
        answerEs: "Puedes lanzar en minutos usando plantillas o demos y luego personalizar colores, textos e imagenes.",
        answerEn: "You can launch in minutes using templates or demos, then customize text, colors, and images.",
        keywords: [
            "tiempo",
            "rapido",
            "lanzar",
            "launch",
            "minutes",
            "minutos"
        ]
    },
    {
        id: "whatsapp",
        quickEs: "Pedidos WhatsApp",
        quickEn: "WhatsApp orders",
        questionEs: "Se integra con pedidos por WhatsApp?",
        questionEn: "Does it integrate with WhatsApp orders?",
        answerEs: "Si. Fast Page conecta carta/tienda con flujo de pedido y redireccion directa a WhatsApp del negocio.",
        answerEn: "Yes. Fast Page connects menu/store flows with direct order redirection to your business WhatsApp.",
        keywords: [
            "whatsapp",
            "pedido",
            "orders",
            "chat",
            "ventas",
            "sales"
        ]
    },
    {
        id: "domain",
        quickEs: "Dominio propio",
        quickEn: "Custom domain",
        questionEs: "Puedo usar mi dominio propio?",
        questionEn: "Can I use my own domain?",
        answerEs: "Si, con planes Business o Pro puedes usar dominio propio y escalar con mas control de marca.",
        answerEn: "Yes, with Business or Pro you can use a custom domain and scale with stronger branding control.",
        keywords: [
            "dominio",
            "domain",
            "custom",
            "marca",
            "branding"
        ]
    }
];
function normalizeText(input) {
    return String(input || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}
function shouldRenderGuestSupport(pathname) {
    if (!pathname) return false;
    if (pathname === "/" || pathname === "/auth" || pathname === "/signup") return true;
    if (pathname === "/demo" || pathname.startsWith("/demo/")) return true;
    return false;
}
function GuestSupportWidget() {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const { language } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$LanguageContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLanguage"])();
    const isEnglish = language === "en";
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [activeFaqId, setActiveFaqId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(SUPPORT_FAQ[0].id);
    const [answer, setAnswer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(isEnglish ? SUPPORT_FAQ[0].answerEn : SUPPORT_FAQ[0].answerEs);
    const rootRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const shouldRender = shouldRenderGuestSupport(pathname || "");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setAnswer(isEnglish ? SUPPORT_FAQ[0].answerEn : SUPPORT_FAQ[0].answerEs);
        setActiveFaqId(SUPPORT_FAQ[0].id);
    }, [
        isEnglish
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!open) return;
        const onPointerDown = (event)=>{
            if (!rootRef.current) return;
            if (!rootRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", onPointerDown);
        return ()=>document.removeEventListener("mousedown", onPointerDown);
    }, [
        open
    ]);
    const panelTitle = isEnglish ? "Customer Support" : "Atencion al cliente";
    const panelSubtitle = isEnglish ? "Questions about fastpagepro.com? We can help now." : "Dudas sobre fastpagepro.com? Te ayudamos ahora.";
    const askPlaceholder = isEnglish ? "Type your question..." : "Escribe tu duda...";
    const askButton = isEnglish ? "Answer" : "Responder";
    const chatButton = isEnglish ? "Chat on WhatsApp" : "Ir a WhatsApp";
    const miniLabel = isEnglish ? "Quick help" : "Ayuda rapida";
    const openLabel = isEnglish ? "Open support chat" : "Abrir ayuda al cliente";
    const currentQuestion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const selected = SUPPORT_FAQ.find((entry)=>entry.id === activeFaqId);
        return selected ? isEnglish ? selected.questionEn : selected.questionEs : "";
    }, [
        activeFaqId,
        isEnglish
    ]);
    const whatsappUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const sourceQuestion = input.trim() || currentQuestion || (isEnglish ? "I have a question about Fast Page." : "Tengo una duda sobre Fast Page.");
        const text = isEnglish ? `Hi Fast Page team, I am a new visitor and I need help: ${sourceQuestion}` : `Hola equipo Fast Page, soy visitante nuevo y necesito ayuda: ${sourceQuestion}`;
        return `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(text)}`;
    }, [
        currentQuestion,
        input,
        isEnglish
    ]);
    function resolveAnswer(question) {
        const normalized = normalizeText(question);
        if (!normalized) {
            const first = SUPPORT_FAQ[0];
            return {
                id: first.id,
                text: isEnglish ? first.answerEn : first.answerEs
            };
        }
        const match = SUPPORT_FAQ.find((item)=>item.keywords.some((keyword)=>normalized.includes(normalizeText(keyword))));
        if (!match) {
            return {
                id: "fallback",
                text: isEnglish ? "We can solve this quickly. Send us your question on WhatsApp and we will guide you step by step." : "Lo resolvemos rapido. Enviamos tu consulta por WhatsApp y te guiamos paso a paso."
            };
        }
        return {
            id: match.id,
            text: isEnglish ? match.answerEn : match.answerEs
        };
    }
    function onAsk(event) {
        event.preventDefault();
        const result = resolveAnswer(input);
        setActiveFaqId(result.id);
        setAnswer(result.text);
    }
    function onPickFaq(faq) {
        setActiveFaqId(faq.id);
        setInput(isEnglish ? faq.questionEn : faq.questionEs);
        setAnswer(isEnglish ? faq.answerEn : faq.answerEs);
    }
    if (!shouldRender) return null;
    const demoOffsetClass = (()=>{
        if (pathname === "/") {
            return "mb-[calc(env(safe-area-inset-bottom)+7rem)] md:mb-0";
        }
        if (pathname === "/demo" || pathname?.startsWith("/demo/")) {
            return "mb-[calc(env(safe-area-inset-bottom)+5.35rem)] md:mb-[5.5rem]";
        }
        return "mb-0";
    })();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: rootRef,
        className: `relative w-14 ${demoOffsetClass}`,
        "data-guest-support-widget": "true",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `absolute bottom-[calc(100%+0.55rem)] right-0 w-[92vw] max-w-[380px] transition-all duration-300 ${open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "overflow-hidden rounded-3xl border border-amber-300/30 bg-[linear-gradient(160deg,rgba(8,10,14,0.98),rgba(6,12,11,0.98))] shadow-[0_18px_45px_rgba(0,0,0,0.55)] max-h-[70vh] flex flex-col",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                            className: "border-b border-amber-300/20 bg-[linear-gradient(135deg,rgba(251,191,36,0.18),rgba(16,185,129,0.16))] px-4 py-3",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[11px] font-black uppercase tracking-[0.15em] text-amber-200",
                                                children: miniLabel
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/GuestSupportWidget.tsx",
                                                lineNumber: 206,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "mt-0.5 text-sm font-black text-white",
                                                children: panelTitle
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/GuestSupportWidget.tsx",
                                                lineNumber: 207,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-1 text-xs text-zinc-200/85",
                                                children: panelSubtitle
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/GuestSupportWidget.tsx",
                                                lineNumber: 208,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/GuestSupportWidget.tsx",
                                        lineNumber: 205,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setOpen(false),
                                        className: "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-zinc-200 transition hover:border-amber-300/45 hover:text-amber-100",
                                        "aria-label": isEnglish ? "Close support panel" : "Cerrar panel de ayuda",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/GuestSupportWidget.tsx",
                                            lineNumber: 216,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/GuestSupportWidget.tsx",
                                        lineNumber: 210,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/GuestSupportWidget.tsx",
                                lineNumber: 204,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/GuestSupportWidget.tsx",
                            lineNumber: 203,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3 px-4 py-3 overflow-y-auto",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-1.5",
                                    children: SUPPORT_FAQ.map((faq)=>{
                                        const active = activeFaqId === faq.id;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>onPickFaq(faq),
                                            className: `min-w-0 rounded-full border px-2.5 py-1 text-[11px] font-bold transition ${active ? "border-emerald-300/60 bg-emerald-400/15 text-emerald-100" : "border-white/15 bg-white/5 text-zinc-200 hover:border-amber-300/50 hover:text-amber-100"}`,
                                            title: isEnglish ? faq.questionEn : faq.questionEs,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "block truncate",
                                                children: isEnglish ? faq.quickEn : faq.quickEs
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/GuestSupportWidget.tsx",
                                                lineNumber: 237,
                                                columnNumber: 21
                                            }, this)
                                        }, faq.id, false, {
                                            fileName: "[project]/src/components/GuestSupportWidget.tsx",
                                            lineNumber: 226,
                                            columnNumber: 19
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/src/components/GuestSupportWidget.tsx",
                                    lineNumber: 222,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-2xl border border-emerald-300/25 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-100",
                                    children: answer
                                }, void 0, false, {
                                    fileName: "[project]/src/components/GuestSupportWidget.tsx",
                                    lineNumber: 243,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                    onSubmit: onAsk,
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            value: input,
                                            onChange: (event)=>setInput(event.target.value),
                                            placeholder: askPlaceholder,
                                            className: "h-10 min-w-0 w-full rounded-xl border border-white/15 bg-black/35 px-3 text-sm text-white outline-none transition focus:border-amber-300/50"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/GuestSupportWidget.tsx",
                                            lineNumber: 248,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            className: "inline-flex h-10 shrink-0 items-center justify-center gap-1 rounded-xl border border-amber-300/45 bg-amber-400/15 px-3 text-xs font-black text-amber-100 transition hover:bg-amber-400/20",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                                                    className: "h-3.5 w-3.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/GuestSupportWidget.tsx",
                                                    lineNumber: 258,
                                                    columnNumber: 17
                                                }, this),
                                                askButton
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/GuestSupportWidget.tsx",
                                            lineNumber: 254,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/GuestSupportWidget.tsx",
                                    lineNumber: 247,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: whatsappUrl,
                                            target: "_blank",
                                            rel: "noreferrer",
                                            className: "inline-flex h-10 items-center gap-2 rounded-xl border border-emerald-300/55 bg-emerald-500/18 px-3 text-xs font-black text-emerald-100 transition hover:bg-emerald-500/26",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/GuestSupportWidget.tsx",
                                                    lineNumber: 270,
                                                    columnNumber: 17
                                                }, this),
                                                chatButton
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/GuestSupportWidget.tsx",
                                            lineNumber: 264,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/auth?tab=register",
                                            className: "inline-flex h-10 items-center rounded-xl border border-white/15 bg-white/5 px-3 text-xs font-bold text-zinc-100 transition hover:border-amber-300/45 hover:text-amber-100",
                                            children: isEnglish ? "Create account" : "Crear cuenta"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/GuestSupportWidget.tsx",
                                            lineNumber: 273,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/GuestSupportWidget.tsx",
                                    lineNumber: 263,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/GuestSupportWidget.tsx",
                            lineNumber: 221,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/GuestSupportWidget.tsx",
                    lineNumber: 202,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/GuestSupportWidget.tsx",
                lineNumber: 197,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>setOpen((current)=>!current),
                className: "group relative inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-300/45 bg-[linear-gradient(150deg,rgba(251,191,36,0.24),rgba(16,185,129,0.26))] text-white shadow-[0_10px_28px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-105",
                "aria-label": openLabel,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute inset-0 rounded-2xl border border-emerald-300/30 opacity-75 animate-pulse"
                    }, void 0, false, {
                        fileName: "[project]/src/components/GuestSupportWidget.tsx",
                        lineNumber: 290,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                        className: "relative h-6 w-6 text-emerald-50 drop-shadow-[0_0_10px_rgba(16,185,129,0.45)]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/GuestSupportWidget.tsx",
                        lineNumber: 291,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                        className: "absolute -top-1 -right-1 h-3.5 w-3.5 text-amber-200"
                    }, void 0, false, {
                        fileName: "[project]/src/components/GuestSupportWidget.tsx",
                        lineNumber: 292,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/GuestSupportWidget.tsx",
                lineNumber: 284,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/GuestSupportWidget.tsx",
        lineNumber: 192,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/FloatingControls.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FloatingControls
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$LanguageContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/LanguageContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-up.js [app-ssr] (ecmascript) <export default as ArrowUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$GuestSupportWidget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/GuestSupportWidget.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
function FloatingControls() {
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$LanguageContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLanguage"])();
    const [showScrollTop, setShowScrollTop] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const isPublicBio = pathname?.startsWith("/bio/");
    const isDemoRoute = pathname === "/demo" || pathname?.startsWith("/demo/");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setMounted(true);
        if (isPublicBio) {
            setShowScrollTop(false);
            return;
        }
        const handleScroll = ()=>{
            setShowScrollTop(window.scrollY > 300);
        };
        window.addEventListener("scroll", handleScroll);
        return ()=>window.removeEventListener("scroll", handleScroll);
    }, [
        isPublicBio
    ]);
    if (!mounted) return null;
    const scrollToTop = ()=>{
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };
    const wrapperClass = isPublicBio ? "fixed bottom-3 right-3 z-[80] flex flex-col gap-2" : "fixed bottom-4 right-4 md:bottom-6 md:right-6 flex flex-col gap-2 md:gap-3 z-50";
    const scrollTopClass = isDemoRoute ? "fixed left-4 bottom-[calc(env(safe-area-inset-bottom)+5.6rem)] md:left-6 md:bottom-6 z-[90] p-1.5 md:p-2 bg-zinc-900 border border-zinc-800 rounded-full shadow-xl hover:scale-110 transition-all group animate-fade-in" : "p-1.5 md:p-2 bg-zinc-900 border border-zinc-800 rounded-full shadow-xl hover:scale-110 transition-all group animate-fade-in";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: wrapperClass,
        children: [
            !isPublicBio && showScrollTop && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: scrollToTop,
                className: scrollTopClass,
                "aria-label": t("floating.scrollTop"),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUp$3e$__["ArrowUp"], {
                    className: "w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-400"
                }, void 0, false, {
                    fileName: "[project]/src/components/FloatingControls.tsx",
                    lineNumber: 53,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/FloatingControls.tsx",
                lineNumber: 48,
                columnNumber: 9
            }, this),
            !isPublicBio && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$GuestSupportWidget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/components/FloatingControls.tsx",
                lineNumber: 57,
                columnNumber: 24
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/FloatingControls.tsx",
        lineNumber: 45,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/ServiceWorkerCleanup.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ServiceWorkerCleanup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
const CLEANUP_KEY = "fp_sw_cleanup_v2";
const ACTIVE_PWA_SW_PATH = "/sw.js";
const PWA_CACHE_PREFIX = "fastpage-pwa-";
const CLEANUP_TTL_MS = 5 * 60 * 1000;
function resolveScriptURL(registration) {
    return registration.active?.scriptURL || registration.waiting?.scriptURL || registration.installing?.scriptURL || "";
}
function ServiceWorkerCleanup() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const lastRun = undefined;
        const shouldSkip = undefined;
        const runCleanup = undefined;
    }, []);
    return null;
}
}),
"[project]/src/components/LuxuryCursorEffect.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LuxuryCursorEffect
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function canEnableLuxuryCursor() {
    if ("TURBOPACK compile-time truthy", 1) return false;
    //TURBOPACK unreachable
    ;
    const finePointer = undefined;
    const desktopWidth = undefined;
    const reducedMotion = undefined;
}
function LuxuryCursorEffect() {
    const [enabled, setEnabled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [clicks, setClicks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const clickIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const updateEnabled = ()=>setEnabled(canEnableLuxuryCursor());
        updateEnabled();
        const pointer = window.matchMedia("(pointer: fine)");
        const width = window.matchMedia("(min-width: 1024px)");
        const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
        pointer.addEventListener("change", updateEnabled);
        width.addEventListener("change", updateEnabled);
        motion.addEventListener("change", updateEnabled);
        window.addEventListener("resize", updateEnabled);
        return ()=>{
            pointer.removeEventListener("change", updateEnabled);
            width.removeEventListener("change", updateEnabled);
            motion.removeEventListener("change", updateEnabled);
            window.removeEventListener("resize", updateEnabled);
        };
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!enabled) {
            document.documentElement.classList.remove("fp-gold-cursor-enabled");
            return;
        }
        document.documentElement.classList.add("fp-gold-cursor-enabled");
        const down = (event)=>{
            const id = clickIdRef.current + 1;
            clickIdRef.current = id;
            const click = {
                id,
                x: event.clientX,
                y: event.clientY
            };
            setClicks((previous)=>[
                    ...previous.slice(-4),
                    click
                ]);
            window.setTimeout(()=>{
                setClicks((previous)=>previous.filter((item)=>item.id !== id));
            }, 520);
        };
        window.addEventListener("mousedown", down);
        return ()=>{
            window.removeEventListener("mousedown", down);
            document.documentElement.classList.remove("fp-gold-cursor-enabled");
        };
    }, [
        enabled
    ]);
    if (!enabled) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fp-cursor-layer",
        "data-luxury-cursor": "true",
        "aria-hidden": "true",
        children: clicks.map((click)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fp-cursor-click",
                style: {
                    left: click.x,
                    top: click.y
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "fp-cursor-click-bolt",
                    children: "\u26A1"
                }, void 0, false, {
                    fileName: "[project]/src/components/LuxuryCursorEffect.tsx",
                    lineNumber: 78,
                    columnNumber: 11
                }, this)
            }, click.id, false, {
                fileName: "[project]/src/components/LuxuryCursorEffect.tsx",
                lineNumber: 77,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/LuxuryCursorEffect.tsx",
        lineNumber: 75,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/pwa/PwaServiceWorkerRegistrar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PwaServiceWorkerRegistrar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
const APP_SW_URL = "/sw.js";
const FORCE_UPDATE_INTERVAL_MS = 60 * 1000;
function PwaServiceWorkerRegistrar() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        let hasReloadedOnControllerChange;
        const askWorkerToSkipWaiting = undefined;
        const wireRegistration = undefined;
        const onControllerChange = undefined;
        const registerServiceWorker = undefined;
        const intervalId = undefined;
    }, []);
    return null;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0c674659._.js.map