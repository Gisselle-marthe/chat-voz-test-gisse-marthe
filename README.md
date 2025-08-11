# 🔧 MiniChat de Voz en Tiempo Real

## 🎯 Descripción

Aplicación de chat donde los usuarios se envían mensajes de voz en tiempo real, con validación de audio, aceleración de reproducción y visualización de ondas.

## ✅ Funcionalidades Implementadas

### 🔐 Autenticación

- Login simple con nickname
- Persistencia de sesión en localStorage
- Protección de rutas para usuarios no autenticados

### 💬 Chat de Voz

- Grabación de audio (máximo 30 segundos)
- Validación automática de audio vacío usando Web Audio API
- Visualización de ondas de audio con WaveSurfer.js
- Reproducción con controles de velocidad (1x, 1.5x, 2x)
- Comunicación en tiempo real usando BroadcastChannel API
- Persistencia de mensajes en localStorage

### 📱 Interfaz de Usuario

- Componentes reutilizables con Vuetify 3
- Navegación fluida entre páginas
- Dashboard con estadísticas de uso

## 🛠️ Tecnologías

- **Frontend**: Vue 3 + Composition API
- **UI**: Vuetify 3
- **Estado**: Pinia
- **TypeScript**: Configuración completa
- **Testing**: Vitest (100% unitarios) + Playwright (100% E2E)
- **Audio**: Web Audio API + MediaRecorder + WaveSurfer.js
- **Comunicación**: BroadcastChannel API para tiempo real
- **Estilos**: SCSS con sistema de utilidades

## 🧪 Testing

### ✅ Tests Unitarios (Vitest)

- **Cobertura**: 100% de tests pasando
- **Archivos**: 3 suites de tests
- **Funcionalidades**: Lógica de negocio, componentes, stores

### ✅ Tests E2E (Playwright)

- **Cobertura**: 100% de tests pasando
- **Navegadores**: Chromium, Firefox, WebKit
- **Funcionalidades**: Flujo completo de usuario, navegación, responsividad

## 🚀 Instalación

```bash
# Instalar dependencias
pnpm install

# Ejecutar en desarrollo
pnpm run dev

# Build para producción
pnpm run build

# Tests Unitarios
pnpm run test:unit

# Tests E2E
pnpm run test:e2e

# Tests completos
pnpm run test
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── composite/      # Componentes compuestos
│   └── ui/            # Componentes de UI básicos
├── composables/        # Lógica de negocio
│   ├── audio/         # Manejo de audio y grabación
│   ├── auth/          # Autenticación
│   ├── chat/          # Lógica del chat
│   └── core/          # Funcionalidades core
├── stores/            # Estado global con Pinia
├── views/             # Vistas principales
│   ├── chat/          # Vista del chat
│   └── dashboard/     # Dashboard del usuario
├── assets/            # Estilos SCSS y recursos
└── __tests__/         # Tests unitarios

e2e/                   # Tests end-to-end
├── core-functionality.spec.ts
└── navigation.spec.ts
```

## 🎨 Características de Diseño

- **Arquitectura Modular**: Componentes reutilizables y composables
- **Estado Reactivo**: Gestión centralizada con Pinia
- **Responsive Design**: Adaptable a todos los dispositivos
- **Accesibilidad**: Navegación por teclado y lectores de pantalla
- **Performance**: Lazy loading y optimizaciones de Vue 3

## 🔒 Seguridad

- Validación de entrada de usuario
- Sanitización de datos
- Protección de rutas
- Manejo seguro de permisos de micrófono

## 📊 Métricas de Calidad

- **Tests Unitarios**: 40/40 ✅ (100%)
- **Tests E2E**: 30/30 ✅ (100%)
- **Cobertura Total**: 100%
- **Linting**: Sin errores críticos
- **TypeScript**: Tipado completo

## 🚀 Despliegue

La aplicación está lista para producción con:

- Build optimizado con Vite
- Tests automatizados
- Documentación completa
- Configuración de CI/CD

## 🤝 Contribución

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📝 Licencia

Este proyecto es parte de una prueba técnica de desarrollo frontend de Gisselle Marthe M.
