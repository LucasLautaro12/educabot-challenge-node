# Book Metrics - Challenge EducaBot

Sistema de métricas de libros con backend en Node.js/Express y frontend en React.

## Backend

### Instalación

```bash
cd backend
npm install
```

### Scripts

```bash
# Desarrollo
npm start          # Ejecutar servidor (tsx)
```

### Ejemplos de uso

```bash
# Obtener todas las métricas
curl http://localhost:3000

# Filtrar por autor
curl "http://localhost:3000?author=J.R.R. Tolkien"

# Búsqueda case-insensitive
curl "http://localhost:3000?author=c.s. lewis"
```

### Arquitectura Backend

El backend sigue el principio de **separación por capas**:

1. **Handler** (`metrics.ts`): Maneja HTTP requests/responses
2. **Service** (`metricsService.ts`): Contiene la lógica de negocio
3. **Provider** (`apiBookProvider.ts`): Obtiene datos de la API externa

**Fuente de datos:** https://6781684b85151f714b0aa5db.mockapi.io/api/v1/books

### Testing

Cobertura completa de tests (35+ casos):

- Provider: Manejo de respuestas exitosas y errores
- Service: Cálculos de métricas y casos edge
- Handler: Respuestas HTTP y manejo de errores

```bash
npm test
```

## Frontend

### Tecnologías

- React 18
- Tailwind CSS
- Lucide React (iconos)

### Instalación

```bash
cd frontend
npm install
```

### Scripts

```bash
npm start      # Ejecutar en desarrollo (puerto 3001)
```

### Características

- Búsqueda de libros por autor
- Visualización de métricas:
  - Promedio de unidades vendidas
  - Libro más barato
  - Lista de libros filtrados por autor
- Diseño responsive
- Estados de loading y error
- Búsqueda case-insensitive

### Variables de Entorno

**Backend:**
```bash
PORT=3000  # Puerto del servidor (opcional)
```

## Ejemplos de Uso

1. **Ver todas las métricas**: Abrir la app sin buscar nada
2. **Buscar por autor**: Escribir "J.R.R. Tolkien" y click en "Buscar"
3. **Limpiar búsqueda**: Click en "Limpiar"
4. **Probar otros autores**:
   - C.S. Lewis
   - Ursula K. Le Guin

## Tecnologías y Dependencias

### Backend
- **express**: ^4.18.0 - Framework web
- **cors**: ^2.8.5 - Middleware CORS
- **tsx**: ^4.0.0 - Ejecutor TypeScript
- **vitest**: ^1.0.0 - Framework de testing

### Frontend
- **react**: ^18.2.0 - Librería UI
- **react-dom**: ^18.2.0 - DOM renderer
- **lucide-react**: ^0.263.1 - Iconos
- **tailwindcss**: ^3.4.0 - CSS framework
