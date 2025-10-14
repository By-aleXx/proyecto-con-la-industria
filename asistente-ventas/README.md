# 🤖 Asistente de Ventas - Frontend

Frontend de la aplicación de Asistente de Ventas con IA, adaptado para integrarse con el backend Django.

## 📋 Características Implementadas

### ✅ Autenticación
- **Login**: Inicio de sesión con usuario y contraseña
- **Registro**: Registro de nuevos usuarios
- **Logout**: Cierre de sesión con invalidación de tokens
- **Cambiar contraseña**: Funcionalidad para cambiar la contraseña del usuario
- **Refresh Token**: Renovación automática de tokens de acceso

### ✅ Chat de IA
- **Chat en tiempo real**: Conversación con el asistente de IA
- **Nuevas conversaciones**: Crear múltiples conversaciones
- **Historial de mensajes**: Mantiene el contexto de la conversación
- **Indicador de escritura**: Muestra cuando la IA está respondiendo
- **Subida de imágenes**: Conservada para futura implementación

### ✅ Navegación
- **Menú principal**: Acceso a diferentes funcionalidades
- **Rutas protegidas**: Solo usuarios autenticados pueden acceder
- **Tema claro/oscuro**: Toggle entre modos de visualización

## 🚀 Instalación

### Prerrequisitos
- Node.js 16+ y npm

### Pasos de instalación

1. **Navegar al directorio del frontend**
   ```bash
   cd asistente-ventas
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno** (opcional)
   
   Crear archivo `.env` en la raíz del proyecto:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:8000/api
   ```

4. **Iniciar el servidor de desarrollo**
   ```bash
   npm start
   ```

   La aplicación se abrirá en [http://localhost:3000](http://localhost:3000)

## 🔧 Configuración

### Cambiar la URL del backend

Edita el archivo `src/config/api.js` o configura la variable de entorno `REACT_APP_API_BASE_URL`.

Por defecto apunta a: `http://localhost:8000/api`

## 📁 Estructura del Proyecto

```
asistente-ventas/
├── public/
│   ├── avatar-laura.svg
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── assets/
│   │   ├── engranaje.png
│   │   ├── gear.png
│   │   ├── luna.png
│   │   └── sol.png
│   ├── components/
│   │   ├── AreaSelection.jsx
│   │   ├── ChangePasswordModal.jsx
│   │   ├── ChatRecommendations.jsx
│   │   ├── ClientTypeSelection.jsx
│   │   ├── ErrorScreen.jsx
│   │   ├── LoadingRecommendations.jsx
│   │   ├── LoadingScreen.jsx
│   │   ├── LoginPage.jsx
│   │   ├── MainMenu.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── SearchSelection.jsx
│   │   ├── SettingsMenu.jsx
│   │   └── ThemeToggle.jsx
│   ├── config/
│   │   └── api.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── estilos/
│   │   ├── ChatRecommendations.css
│   │   ├── global.css
│   │   ├── index.css
│   │   ├── LoadingAndError.css
│   │   ├── LoginPage.css
│   │   ├── MainMenu.css
│   │   └── SelectionComponents.css
│   ├── services/
│   │   ├── authService.js
│   │   ├── axiosInterceptor.js
│   │   ├── chatService.js
│   │   └── productService.js
│   ├── App.jsx
│   ├── index.css
│   └── index.js
├── package.json
└── README.md
```

## 🔑 Servicios Implementados

### AuthService
Gestiona toda la autenticación:
- `login(username, password)` - Iniciar sesión
- `register(userData)` - Registrar usuario
- `logout()` - Cerrar sesión
- `changePassword(oldPassword, newPassword)` - Cambiar contraseña
- `getMe()` - Obtener información del usuario actual
- `refreshToken()` - Renovar token de acceso

### ChatService
Gestiona las conversaciones con la IA:
- `sendMessage(mensaje, sessionId, historial)` - Enviar mensaje
- `getHistorial(sessionId)` - Obtener historial
- `getSessions()` - Listar sesiones (pendiente backend)
- `createSession(titulo)` - Crear nueva sesión (pendiente backend)

### ProductService
Gestiona los productos:
- `getProductos(filters)` - Listar productos con filtros
- `getProducto(id)` - Obtener detalle de producto

## 🎨 Funcionalidades de la UI

### Pantalla de Login
- Vista de bienvenida
- Formulario de inicio de sesión
- Formulario de registro
- Validación de formularios
- Mensajes de error amigables

### Chat
- Interfaz de chat moderna
- Avatar del asistente (Laura)
- Burbujas de mensaje diferenciadas
- Botón para nueva conversación
- Botón de cámara (para futura implementación)
- Área de texto con envío por Enter
- Indicador de escritura animado

### Menú Principal
- Opciones contextuales
- Botón flotante para fotos
- Preview de imágenes seleccionadas
- Navegación rápida al chat

### Menú de Configuración
- Toggle de tema claro/oscuro
- Opción de cambiar contraseña
- Opción de cerrar sesión

## 🔐 Seguridad

- **Tokens JWT**: Almacenados en localStorage
- **Refresh automático**: Los tokens se renuevan automáticamente
- **Rutas protegidas**: Solo usuarios autenticados pueden acceder
- **Limpieza de sesión**: Los tokens se eliminan al cerrar sesión

## 📝 Flujo de Autenticación

1. Usuario ingresa credenciales
2. Frontend envía petición a `/api/auth/login/`
3. Backend responde con `access_token`, `refresh_token` y datos del usuario
4. Tokens se almacenan en localStorage
5. Todas las peticiones incluyen el `access_token` en el header
6. Si el token expira (401), se intenta refrescar automáticamente
7. Si el refresh falla, se redirige al login

## 🚧 Pendientes de Implementación en Backend

Las siguientes funcionalidades están preparadas en el frontend pero requieren implementación en el backend:

1. **Listar sesiones de chat**: `GET /api/chat/sessions/`
2. **Crear nueva sesión**: `POST /api/chat/sessions/`
3. **Análisis de imágenes**: Integración con extracción de colores

## 🐛 Debugging

### Ver tokens almacenados
Abre la consola del navegador:
```javascript
localStorage.getItem('accessToken')
localStorage.getItem('refreshToken')
localStorage.getItem('user')
```

### Ver peticiones al backend
Abre las DevTools → Network → XHR/Fetch

### Limpiar sesión manualmente
```javascript
localStorage.clear()
```

## 📦 Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm build` - Compila la aplicación para producción
- `npm test` - Ejecuta las pruebas
- `npm eject` - Expone la configuración de webpack

## 🌐 Variables de Entorno

Crear un archivo `.env.local` en la raíz:

```env
# URL del backend (opcional, por defecto usa http://localhost:8000/api)
REACT_APP_API_BASE_URL=http://localhost:8000/api

# Otros
REACT_APP_ENV=development
```

## 🤝 Integración con Backend

El frontend está diseñado para integrarse con el backend Django según el contrato de API proporcionado.

### Endpoints esperados:

#### Autenticación
- `POST /api/auth/register/` - Registro
- `POST /api/auth/login/` - Login
- `POST /api/auth/refresh/` - Refresh token
- `POST /api/auth/logout/` - Logout
- `POST /api/auth/change-password/` - Cambiar contraseña
- `GET /api/me/` - Usuario actual

#### Chat
- `POST /api/chat/` - Enviar mensaje
- `GET /api/chat/historial/` - Obtener historial
- `GET /api/chat/sessions/` - Listar sesiones (pendiente)
- `POST /api/chat/sessions/` - Crear sesión (pendiente)

#### Productos
- `GET /api/productos/` - Listar productos
- `GET /api/productos/{id}/` - Detalle de producto

## 🎯 Características Conservadas

- **Subida de fotos**: Botón de cámara y selector de archivos
- **Preview de imágenes**: Muestra la imagen seleccionada
- **Modo oscuro**: Toggle entre temas
- **Animaciones**: Transiciones suaves con anime.js
- **Diseño responsive**: Adaptado a móviles y tablets

## 📚 Tecnologías Utilizadas

- **React** 19.1.1 - Framework de UI
- **React Router** 6 - Enrutamiento
- **Axios** - Cliente HTTP
- **anime.js** - Animaciones
- **UUID** - Generación de IDs únicos
- **localStorage** - Almacenamiento de tokens

## 🔄 Próximos Pasos

1. Implementar historial de conversaciones en el backend
2. Integrar análisis de imágenes con extracción de colores
3. Añadir notificaciones en tiempo real
4. Implementar paginación en el historial
5. Añadir búsqueda de productos
6. Mejorar manejo de errores

## 👥 Soporte

Para reportar problemas o sugerencias, contacta al equipo de desarrollo.

---

**Versión**: 2.0  
**Última actualización**: Octubre 2025  
**Estado**: Producción
