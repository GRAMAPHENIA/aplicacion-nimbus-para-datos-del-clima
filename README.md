
# Aplicación de Datos del Clima

Una aplicación que proporciona información meteorológica detallada para la región de Argentina, diseñada para ser precisa y fácil de usar. Construida con tecnologías modernas para garantizar una experiencia fluida y atractiva.

## Características

- **Datos meteorológicos en tiempo real:**
  - Condiciones actuales como temperatura, humedad y velocidad del viento.
  - Pronóstico extendido para varios días.

- **Funcionalidades específicas:**
  - Búsqueda de ciudades dentro de Argentina.
  - Mapas interactivos de clima.
  - Alertas meteorológicas personalizadas.

## Comenzar

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Ejecutar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

3. Abrir [http://localhost:3000](http://localhost:3000) en tu navegador.

## Stack Tecnológico

- Next.js 14
- TypeScript
- Tailwind CSS
- Radix UI
- clsx para manejo dinámico de clases
- tailwind-merge para utilidades de diseño
- Integración con APIs externas para datos meteorológicos

## Estructura del Proyecto

- `/components` - Componentes reutilizables de React.
- `/lib` - Funciones de utilidad e integración con APIs.
- `/types` - Definiciones de tipos en TypeScript.
- `/app` - Páginas del router de Next.js.

## Capturas de pantalla

### Vista principal

![Vista principal](/public/vista-principal-clima.png)

### Pronóstico por ciudad

![Pronóstico](/public/pronostico-ciudad.png)
