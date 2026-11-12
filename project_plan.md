# Motora — Marketplace de autos en Costa Rica

## 1. Project Description
Marketplace de compra y venta de vehículos usados y nuevos en Costa Rica, inspirado en la categoría de CR Autos pero con una experiencia mucho más limpia, moderna y orientada a la conversión. El visitante encuentra su carro en pocos clics y el vendedor publica su anuncio en minutos.

- Público objetivo: compradores de 25–55 años en Costa Rica y vendedores particulares o agencias pequeñas.
- Propuesta de valor: búsqueda rápida y clara, fichas de vehículo completas, contacto directo con el vendedor y publicación gratuita.

## 2. Page Structure
- `/` — Inicio: buscador, marcas, tipos de carro, destacados, recién publicados, cómo funciona.
- `/autos` — Catálogo con filtros (marca, precio, año, provincia, tipo, transmisión, combustible, condición) y ordenamiento.
- `/auto/:id` — Ficha del vehículo: galería, especificaciones, descripción, vendedor, contacto, similares.
- `/ingresar` — Inicio de sesión.
- `/registro` — Crear cuenta.
- `/mi-cuenta` — Panel del usuario: mis anuncios, favoritos y datos de perfil (requiere sesión).
- `/publicar` — Publicar un nuevo anuncio con fotos (requiere sesión).
- `*` — Página no encontrada.

## 3. Core Features
- [x] Buscador principal por marca, tipo, provincia y precio máximo
- [x] Catálogo con filtros combinables y ordenamiento
- [x] Ficha de vehículo con galería, especificaciones y similares
- [x] Favoritos por usuario (persistidos en base de datos)
- [x] Registro e inicio de sesión con correo y contraseña
- [x] Panel de cuenta con mis anuncios, favoritos y perfil
- [x] Publicación de anuncios con subida de fotos
- [x] Contacto al vendedor desde la ficha (registro de consulta)
- [ ] Verificación de correo y recuperación de contraseña (fase posterior)
- [ ] Mensajería interna entre comprador y vendedor (fase posterior)

## 4. Data Model Design

### Table: profiles
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | PK, referencia a auth.users |
| full_name | text | Nombre completo |
| phone | text | Teléfono de contacto |
| province | text | Provincia |
| role | text | user / dealer |
| created_at | timestamptz | Fecha de creación |

### Table: vehicles
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | PK |
| seller_id | uuid | Usuario que publica (null en anuncios demo) |
| seller_name / seller_phone | text | Datos visibles del vendedor |
| title, brand, model | text | Identificación del vehículo |
| year, price, currency, mileage | int / numeric / text | Datos comerciales |
| transmission, fuel_type, body_type, condition | text | Especificaciones |
| province, city | text | Ubicación |
| description | text | Descripción libre |
| images | text[] | URLs de fotos |
| features | text[] | Extras del vehículo |
| status | text | active / sold / paused |
| views, featured | int / bool | Métricas y destacado |
| created_at, updated_at | timestamptz | Fechas |

### Table: favorites
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | PK |
| user_id | uuid | Usuario |
| vehicle_id | uuid | Vehículo |
| unique (user_id, vehicle_id) | | Un favorito por vehículo |

### Table: inquiries
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | PK |
| vehicle_id | uuid | Vehículo consultado |
| seller_id / buyer_id | uuid | Vendedor y comprador |
| name, email, phone, message | text | Datos del mensaje |

## 5. Backend / Third-party Integration Plan
- Database: SaaS Supabase conectado (Auth + Postgres + Storage).
- Storage: bucket público `vehicle-photos` para las fotos de los anuncios.
- Shopify: no requerido.
- Stripe / Toss / PayPal / Square: no requerido en esta etapa (la venta se cierra por contacto directo).
- Email transaccional (Resend): no requerido en esta etapa.

## 6. Development Phase Plan

### Phase 1: Base del marketplace y cuentas de usuario
- Goal: sitio navegable y funcional con datos reales y autenticación.
- Deliverable: inicio, catálogo con filtros, ficha de vehículo, registro, inicio de sesión, panel de cuenta con favoritos y cabecera/footer globales.

### Phase 2: Publicación de anuncios
- Goal: que cualquier usuario registrado publique su vehículo con fotos.
- Deliverable: formulario de publicación con subida de imágenes, edición y cambio de estado del anuncio.

### Phase 3: Confianza y crecimiento
- Goal: reforzar credibilidad y captación.
- Deliverable: verificación de correo, recuperación de contraseña, formulario de contacto del sitio y páginas legales.