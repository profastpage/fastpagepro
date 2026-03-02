# Context

## 2026-03-02

- Demos publicas de landing (`/demo`) para restaurante, ecommerce y servicios:
  - los botones/carro que redirigen a WhatsApp ahora usan siempre el numero oficial `51919662011`.
  - la demo de restaurante tambien fija el CTA de llamada a `tel:+51919662011`.
- Flujos base sin demo:
  - `TemplateGenerator` usa `51919662011` como numero placeholder por defecto.
  - defaults iniciales del editor de tienda (`/store`) usan `51919662011`.
  - seeds de demo accounts ahora asignan `51919662011`.
- WhatsApp con emojis estables (demo + cuentas registradas):
  - se agrego helper compartido `src/lib/whatsapp.ts` para generar links con `https://api.whatsapp.com/send` y `URLSearchParams`.
  - las cartas digitales publicadas (`/bio/[slug]`) usan el helper en contacto, pedido de carrito y reserva.
  - el preview del editor LinkHub (`/linkhub`) tambien usa el mismo helper.
- Carta digital mas visual (demo + cuentas registradas):
  - se aumentaron dimensiones de tarjetas de productos en la seccion carta para mobile-first.
  - imagenes, tipografia, precio y controles de cantidad ahora tienen mayor presencia visual.
  - aplica en demo sin registro (`RestaurantDemo`) y en carta publicada de cuentas registradas (`ProductCard` en `/bio/[slug]`).
  - se reforzo tambien el preview de carta en `/linkhub` para que el tamano visible de items se acerque al render final mobile.
  - ajuste fino adicional: badge mas compacto y stepper tipo pildora mas corto para acercar la UI al layout de referencia (imagen 2).
  - ajuste adicional: precios reducidos en tarjetas de carta para demo sin registro y carta publicada con registro.
