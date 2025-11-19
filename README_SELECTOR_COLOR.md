# 🎨 Selector de Color - Guía Rápida

## 🚀 Inicio Rápido

### Instalación
```bash
cd asistente-ventas
npm install
npm start
```

La aplicación se abrirá en `http://localhost:3000`

## 📱 Cómo Usar el Selector de Color

### 1️⃣ Acceder al Menú Principal
- Inicia sesión en la aplicación
- Navega al menú principal

### 2️⃣ Capturar o Subir una Foto
- Haz clic en el botón de cámara 📸 (esquina inferior derecha)
- Selecciona:
  - **Tomar foto**: Si tu dispositivo tiene cámara
  - **Subir foto**: Para elegir de tu galería

### 3️⃣ Usar el Cuentagotas
Se abrirá automáticamente el selector de color:

```
┌────────────────────────────────────┐
│ Selecciona el color del piso    ✕ │
├────────────────────────────────────┤
│                                    │
│      [Tu imagen aparece aquí]      │
│              💧                    │
│        (arrastra el gotero)        │
│                                    │
├────────────────────────────────────┤
│   🔍−    100%    🔍+              │
├────────────────────────────────────┤
│ Color seleccionado:                │
│ ┌───┐ HEX: #A67B5B                │
│ │███│ RGB: rgb(166, 123, 91)      │
│ └───┘                              │
├────────────────────────────────────┤
│ [Cancelar]  [Confirmar Color]      │
└────────────────────────────────────┘
```

### 4️⃣ Seleccionar el Color
- **En PC**: Haz clic y arrastra sobre la imagen
- **En Móvil**: Toca y desliza tu dedo sobre la imagen
- El cuentagotas 💧 seguirá tu cursor/dedo
- El color se actualiza en tiempo real

### 5️⃣ Ajustar Precisión
- Usa **🔍+** para acercar (hasta 300%)
- Usa **🔍−** para alejar (hasta 50%)
- Esto te ayuda a seleccionar detalles pequeños

### 6️⃣ Confirmar
- Cuando encuentres el color deseado, haz clic en **"Confirmar Color"**
- El color se guardará y verás un preview en la esquina inferior derecha

### 7️⃣ Usar el Color Guardado
- El color aparece como una muestra con su código HEX
- Puedes hacer clic en la muestra para volver a abrir el selector
- El color está listo para usarse en búsquedas

## 🎯 Características Principales

### ✅ Funciona en Cualquier Dispositivo
- ✅ PC/Laptop (Windows, Mac, Linux)
- ✅ Tablets
- ✅ Smartphones (iOS, Android)

### ✅ Métodos de Entrada
- ✅ Cámara del dispositivo
- ✅ Galería/Archivos
- ✅ Formatos: JPG, PNG, WebP, GIF

### ✅ Interacción
- ✅ Mouse (PC)
- ✅ Touch (Móvil/Tablet)
- ✅ Zoom in/out
- ✅ Arrastre suave y fluido

### ✅ Información del Color
- ✅ Código HEX (#RRGGBB)
- ✅ Valores RGB (Red, Green, Blue)
- ✅ Preview visual del color

## 🎨 Ejemplos de Uso

### Caso 1: Cliente con Foto de Piso
```
Cliente: "Quiero un piso de este color"
        [Muestra foto en su teléfono]

Vendedor:
1. Haz clic en 📸
2. Selecciona "Subir foto"
3. Elige la foto del cliente
4. Arrastra el gotero sobre el área del piso
5. Confirma el color
6. [Sistema busca pisos similares]
```

### Caso 2: Matching Exacto
```
Diseñador: "Necesito el código exacto de este color"

Pasos:
1. Sube la imagen de referencia
2. Usa zoom para precisión
3. Selecciona el color exacto
4. Copia el código HEX mostrado
   Ejemplo: #A67B5B
5. Úsalo en especificaciones técnicas
```

### Caso 3: Comparación de Colores
```
Cliente: "¿Estos dos pisos son del mismo color?"

Pasos:
1. Sube primera foto
2. Selecciona color → Anota HEX
3. Cierra y sube segunda foto
4. Selecciona color → Compara HEX
5. Si los códigos coinciden, son idénticos
```

## 📱 Tips para Mejores Resultados

### 📸 Al Tomar/Subir Fotos
- ✅ Buena iluminación natural
- ✅ Foto enfocada y nítida
- ✅ Evita sombras o reflejos
- ✅ Captura perpendicular (no en ángulo)
- ⚠️ Evita flash directo

### 🎯 Al Seleccionar Color
- ✅ Usa zoom para áreas pequeñas
- ✅ Selecciona varias veces para confirmar
- ✅ Elige áreas representativas
- ⚠️ Evita bordes o transiciones
- ⚠️ Evita áreas con sombra

### 🔍 Para Precisión Máxima
- ✅ Aumenta zoom al 200-300%
- ✅ Selecciona el centro del color
- ✅ Verifica valores RGB consistentes
- ✅ Compara con muestra física si está disponible

## 🎨 Entendiendo los Códigos de Color

### Formato HEX
```
#A67B5B
 │││││└─ Blue (91 en decimal)
 ││││└── Blue
 │││└─── Green (123 en decimal)
 ││└──── Green
 │└───── Red (166 en decimal)
 └────── Red
```

### Formato RGB
```
rgb(166, 123, 91)
    │    │    └─ Blue: 0-255
    │    └────── Green: 0-255
    └─────────── Red: 0-255
```

### Interpretación
- **R > G > B** → Tonos rojizos/anaranjados
- **G > R > B** → Tonos verdosos
- **B > R > G** → Tonos azulados
- **R ≈ G ≈ B** → Tonos grises/neutros

## 🔧 Troubleshooting

### Problema: No puedo tomar fotos
**Solución**: 
- Verifica permisos de cámara en el navegador
- Usa "Subir foto" como alternativa

### Problema: El cuentagotas no se mueve
**Solución**:
- Asegúrate de hacer clic/tocar sobre la imagen
- Recarga la página si persiste

### Problema: Los colores se ven diferentes
**Solución**:
- La pantalla puede afectar la percepción
- Usa los códigos HEX/RGB como referencia objetiva
- Calibra la pantalla si es posible

### Problema: La imagen está borrosa
**Solución**:
- Sube una foto de mayor calidad
- Asegúrate de que la foto original esté enfocada

### Problema: No puedo hacer zoom
**Solución**:
- Verifica que la imagen esté cargada
- Usa los botones 🔍+ y 🔍−
- El rango es 50% - 300%

## 📊 Atajos de Teclado (Próximamente)

| Tecla | Acción |
|-------|--------|
| `+` | Zoom in |
| `-` | Zoom out |
| `Enter` | Confirmar color |
| `Esc` | Cancelar |
| `Space` | Re-centrar imagen |

## 🌐 Navegadores Soportados

| Navegador | Versión Mínima | Estado |
|-----------|----------------|--------|
| Chrome | 90+ | ✅ Completo |
| Firefox | 88+ | ✅ Completo |
| Safari | 14+ | ✅ Completo |
| Edge | 90+ | ✅ Completo |
| Opera | 76+ | ✅ Completo |
| Samsung Internet | 14+ | ✅ Completo |

## 📱 Dispositivos Probados

### Móviles
- ✅ iPhone (iOS 14+)
- ✅ Samsung Galaxy (Android 10+)
- ✅ Google Pixel (Android 11+)
- ✅ Xiaomi (Android 10+)

### Tablets
- ✅ iPad (iPadOS 14+)
- ✅ Samsung Tab (Android 10+)

### Desktop
- ✅ Windows 10/11
- ✅ macOS 11+
- ✅ Linux (Ubuntu, Fedora)

## 🎓 Video Tutorial

*(Próximamente)*

1. Introducción al selector de color (0:30)
2. Cómo tomar/subir fotos (1:00)
3. Usar el cuentagotas efectivamente (2:00)
4. Zoom y precisión (1:30)
5. Confirmar y usar el color (1:00)

Total: ~6 minutos

## ❓ Preguntas Frecuentes

**P: ¿Qué tan preciso es el selector?**  
R: Pixel-perfect. Detecta el color exacto del pixel seleccionado.

**P: ¿Puedo seleccionar múltiples colores?**  
R: Por ahora uno a la vez, pero puedes repetir el proceso.

**P: ¿Se guardan mis fotos?**  
R: No. El procesamiento es local, las fotos no se suben a ningún servidor.

**P: ¿Funciona sin internet?**  
R: Una vez cargada la aplicación, el selector funciona offline.

**P: ¿Puedo usar esto para otros propósitos?**  
R: ¡Sí! Funciona para cualquier imagen, no solo pisos.

**P: ¿El color depende de la iluminación de la foto?**  
R: Sí. El color detectado es el que aparece en la foto. Para resultados consistentes, usa iluminación similar.

## 🆘 Soporte

Si tienes problemas:
1. ✅ Revisa esta guía
2. ✅ Consulta SELECTOR_COLOR.md (documentación técnica)
3. ✅ Reinicia la aplicación
4. ✅ Limpia caché del navegador
5. ✅ Contacta al equipo de desarrollo

## 📝 Changelog

### Versión 1.0.0 (Octubre 2024)
- ✅ Lanzamiento inicial
- ✅ Cuentagotas arrastrable
- ✅ Soporte móvil y desktop
- ✅ Zoom in/out
- ✅ Detección RGB y HEX
- ✅ Temas claro/oscuro

### Próximamente (v1.1.0)
- 🔄 Historial de colores
- 🔄 Paletas complementarias
- 🔄 Exportar colores
- 🔄 Múltiples puntos de selección

---

**¡Disfruta seleccionando colores!** 🎨✨

