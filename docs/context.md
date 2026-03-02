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
