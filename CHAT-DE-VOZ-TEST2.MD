# Explicación de diseño y UX – MiniChat de Voz en Tiempo Real

Este módulo fue diseñado desde cero para cumplir con los objetivos de la **Prueba Técnica 2: MiniChat de Voz en Tiempo Real**, priorizando la **claridad en la interfaz**, la **facilidad de uso** y la **integración natural de funciones de audio**.

---

## Decisiones clave de diseño

### 1. Simplicidad en el acceso

- **Pantalla de login minimalista**: ingreso rápido con nickname, sin fricciones ni elementos innecesarios.
- Nickname visible dentro del chat para reforzar identidad y contexto.

### 2. Jerarquía visual clara en el chat

- **Mensajes diferenciados**:  
  - Mensajes de sistema con burbuja gris e ícono identificador.  
  - Mensajes de usuario con avatar, nombre y hora de envío.  
- Orden cronológico natural con timestamps visibles.

### 3. Interacciones optimizadas para audio

- Botón de grabación flotante, siempre accesible y con **feedback visual de estado** (activo/inactivo).
- Límite de grabación de 30 segundos, con validación para evitar audios vacíos o silencios prolongados.
- Controles de reproducción simples: play/pause, aceleración (1x, 1.5x, 2x) y visualización de duración.

### 4. Enfoque en la limpieza visual

- Eliminación de ruido visual para centrar la atención en el contenido del audio.
- Espaciado generoso entre mensajes para mejorar legibilidad y escaneabilidad.

### 5. Consistencia y escalabilidad

- Paleta cromática y tipografía coherentes con el resto del producto.
- Componentes modulares, reutilizables y fácilmente integrables en otras vistas (por ejemplo, el dashboard de la Prueba Técnica 1).

---

## Implementación Funcional del Frontend

### 🏗️ Arquitectura de Componentes

La aplicación está estructurada de manera modular y escalable, siguiendo las mejores prácticas de Vue 3. El sistema de chat se organiza en componentes especializados que se comunican entre sí de forma eficiente.

La vista principal del chat coordina todos los elementos: la barra de acciones para grabar y enviar mensajes, el header que muestra la información del usuario, el contenedor de mensajes que gestiona la lista dinámica, y las burbujas individuales que representan cada mensaje de voz.

Los componentes reutilizables incluyen el visualizador de ondas de audio, la navegación lateral, y la barra de búsqueda. Cada uno está diseñado para ser independiente y reutilizable en otras partes de la aplicación.

### 🎤 Sistema de Grabación de Audio

El sistema de grabación utiliza la API MediaRecorder del navegador para capturar audio del micrófono del usuario. Cuando el usuario presiona el botón de grabación, la aplicación solicita permisos de micrófono y comienza a grabar en formato WebM con codec Opus, que proporciona una excelente calidad de audio con archivos compactos.

La grabación se limita a 30 segundos para mantener la experiencia del chat fluida y evitar mensajes demasiado largos. Durante la grabación, se muestra un timer visual que indica cuánto tiempo ha pasado y cuánto queda disponible.

Una característica importante es la validación automática del audio. Utilizando la Web Audio API, el sistema analiza la frecuencia del audio grabado para detectar si contiene sonido real o si es solo silencio. Esto previene el envío de mensajes vacíos y mejora la calidad de la comunicación.

### 🎵 Sistema de Reproducción con WaveSurfer.js

Para la visualización y reproducción de audio, se implementó WaveSurfer.js, una librería especializada en la representación visual de ondas de audio. Cada mensaje de voz se muestra con una representación gráfica de su contenido sonoro, permitiendo a los usuarios identificar visualmente la intensidad y duración del audio antes de reproducirlo.

Los controles de reproducción incluyen botones de play/pause, una barra de progreso que muestra la posición actual en el audio, y un selector de velocidad que permite reproducir el audio a 1x, 1.5x o 2x la velocidad normal. Esta funcionalidad es especialmente útil para mensajes largos o cuando se necesita revisar información rápidamente.

El sistema también incluye control de volumen y la capacidad de saltar a diferentes partes del audio haciendo clic en la visualización de la onda. La duración total del audio se muestra en formato legible (minutos:segundos) para que los usuarios sepan cuánto tiempo durará la reproducción.

### 💬 Sistema de Chat en Tiempo Real

La comunicación en tiempo real se implementa utilizando la API BroadcastChannel, que permite que diferentes pestañas del navegador se comuniquen entre sí. Esto simula un sistema de chat real sin necesidad de un backend, ya que los mensajes se transmiten instantáneamente entre todas las instancias abiertas de la aplicación.

Cuando un usuario graba y envía un mensaje de voz, este se procesa, se valida, y se envía a través del canal de comunicación. Todos los usuarios conectados reciben el mensaje inmediatamente, y la interfaz se actualiza en tiempo real para mostrar el nuevo mensaje en la lista.

El sistema de mensajes incluye metadatos como el ID único del mensaje, el usuario que lo envió, la duración del audio, el timestamp de envío, y los datos de la onda para la visualización. Los mensajes se ordenan cronológicamente, con los más recientes en la parte superior.

### 🔐 Sistema de Autenticación

La autenticación se implementa de manera simple pero efectiva. Los usuarios solo necesitan proporcionar un nickname para acceder al chat, sin necesidad de contraseñas o registros complejos. El sistema genera un ID único para cada usuario.

La información del usuario se almacena en el localStorage del navegador, permitiendo que la sesión persista entre recargas de página. El estado de autenticación se gestiona globalmente usando Pinia, un store de estado moderno para Vue 3.

La protección de rutas se implementa mediante guards de navegación que verifican si el usuario está autenticado antes de permitir el acceso a páginas protegidas. Si un usuario no autenticado intenta acceder al chat, es redirigido automáticamente a la página de login.

### 🎨 Sistema de UI/UX con Vuetify

La interfaz de usuario se construye utilizando Vuetify 3. Los componentes se personalizan para adaptarse a las necesidades específicas del chat de voz, manteniendo la coherencia visual en toda la aplicación.

Los componentes de audio incluyen indicadores visuales claros del estado actual: colores diferentes para grabación activa, procesamiento, y estados de error. Los botones cambian de apariencia según el contexto, proporcionando feedback inmediato al usuario sobre qué acciones están disponibles.

### 📱 Gestión de Estados y Reactividad

Vue 3 con Composition API proporciona un sistema de reactividad robusto que mantiene la interfaz sincronizada con el estado de la aplicación. Cada funcionalidad de audio tiene estados bien definidos: inactivo, grabando, procesando, reproduciendo, y error.

Los estados se reflejan visualmente en la interfaz, con cambios de color, iconos, y comportamientos que guían al usuario a través de cada proceso. Por ejemplo, durante la grabación, el botón principal cambia de azul a rojo, y se muestra un indicador de progreso que se llena gradualmente hasta alcanzar el límite de 30 segundos.

La reactividad también se utiliza para sincronizar la reproducción de audio con la visualización de ondas. Cuando se reproduce un mensaje, la barra de progreso se actualiza en tiempo real, y la posición actual se refleja visualmente en la representación de la onda.

### 🔄 Persistencia y Sincronización

Los mensajes del chat se almacenan en el localStorage del navegador, permitiendo que la conversación persista entre sesiones. Cuando un usuario regresa a la aplicación, todos los mensajes anteriores se cargan automáticamente, manteniendo el contexto de la conversación.

Las preferencias del usuario, como la velocidad de reproducción preferida, también se guardan localmente. Esto personaliza la experiencia para cada usuario, recordando sus configuraciones entre sesiones.

La sincronización en tiempo real se logra mediante el sistema de BroadcastChannel, que mantiene todas las instancias de la aplicación sincronizadas. Si un usuario abre múltiples pestañas, verá los mismos mensajes en todas ellas, y los cambios se reflejan instantáneamente.

---

## Resultado

Un MiniChat de Voz que:

1. **Ofrece una experiencia intuitiva y fluida** para grabar, enviar y reproducir mensajes de voz.  
2. **Presenta los mensajes con claridad** y distinción entre tipos de remitente.  
3. **Integra de forma natural funciones avanzadas** como validación de audio y control de velocidad de reproducción.  
4. **Mantiene una base de diseño modular** para su reutilización y extensión en otros contextos.
5. **Implementa tecnologías modernas** como Web Audio API, MediaRecorder, WaveSurfer.js y BroadcastChannel.
6. **Utiliza arquitectura Vue 3** con Composition API, Pinia para estado y Vuetify para UI.
7. **Proporciona feedback visual completo** en todas las interacciones de audio.



