# 🎨 Selector de Color con Cuentagotas - Guía de Uso

## 📋 Descripción General

El selector de color es una funcionalidad avanzada que permite a los usuarios capturar o subir fotos de pisos y seleccionar colores específicos mediante un cuentagotas interactivo. Esta herramienta es útil para identificar colores exactos de pisos que los clientes desean replicar.

## ✨ Características Principales

### 🎯 Funcionalidades
- **Captura desde cámara**: Toma fotos directamente desde la cámara del dispositivo
- **Subida desde galería**: Selecciona fotos existentes de la galería
- **Cuentagotas interactivo**: Arrastra el gotero sobre la imagen para seleccionar colores
- **Detección en tiempo real**: Ve el color seleccionado mientras mueves el gotero
- **Zoom**: Acerca/aleja la imagen para seleccionar con precisión
- **Valores de color**: Obtén códigos HEX y RGB del color seleccionado
- **Responsive**: Funciona perfectamente en móvil y escritorio
- **Soporte táctil**: Optimizado para pantallas táctiles

### 🎨 Componentes
1. **ColorPickerModal.jsx**: Componente principal del selector
2. **ColorPickerModal.css**: Estilos responsive y animaciones
3. **MainMenu.jsx**: Integración con el menú principal

## 🚀 Cómo Usar

### Paso 1: Capturar o Subir Foto
1. Haz clic en el botón de cámara 📸 (esquina inferior derecha)
2. Elige entre:
   - **Tomar foto**: Usa la cámara del dispositivo
   - **Subir desde galería**: Selecciona una foto existente

### Paso 2: Seleccionar Color
1. Se abrirá el modal del selector de color
2. Mueve el cursor/dedo sobre la imagen
3. El cuentagotas 💧 seguirá tu movimiento
4. El color bajo el cuentagotas se mostrará en tiempo real

### Paso 3: Ajustar con Zoom (Opcional)
1. Usa los botones **🔍−** y **🔍+** para ajustar el zoom
2. Esto te permite ver detalles más pequeños de la imagen
3. El nivel de zoom se muestra en porcentaje

### Paso 4: Confirmar Color
1. Una vez que encuentres el color deseado, haz clic en **"Confirmar Color"**
2. El color seleccionado se guardará
3. Verás un preview del color en la esquina inferior derecha

### Paso 5: Usar el Color
1. El color confirmado aparece como una muestra con su código HEX
2. Puedes hacer clic en la muestra para volver a abrir el selector
3. El color está disponible para búsquedas de productos

## 🖥️ Interfaz del Selector

### Elementos de la Interfaz

```
┌─────────────────────────────────────────┐
│  Selecciona el color del piso        ✕ │
├─────────────────────────────────────────┤
│                                         │
│         [Imagen con Canvas]             │
│              💧 ← Cuentagotas          │
│                                         │
├─────────────────────────────────────────┤
│        🔍−    100%    🔍+              │  ← Zoom
├─────────────────────────────────────────┤
│  Color seleccionado:                    │
│  ┌────┐  HEX: #A67B5B                  │  ← Preview
│  │████│  RGB: rgb(166, 123, 91)        │
│  └────┘                                 │
├─────────────────────────────────────────┤
│  📱 Toca o arrastra sobre la imagen    │  ← Instrucciones
│  🔍 Usa los botones de zoom            │
├─────────────────────────────────────────┤
│         [Cancelar]  [Confirmar Color]   │  ← Acciones
└─────────────────────────────────────────┘
```

## 💻 Detalles Técnicos

### Arquitectura

#### ColorPickerModal.jsx
```javascript
Props:
- isOpen: boolean          // Controla la visibilidad del modal
- onClose: function        // Callback al cerrar
- imageUrl: string         // URL de la imagen (data URL)
- isDark: boolean          // Tema claro/oscuro
- onColorConfirmed: function // Callback con el color seleccionado

Estado interno:
- selectedColor: object    // Color actual { hex, rgb, r, g, b, a }
- pickerPosition: object   // Posición del gotero { x, y }
- isDragging: boolean      // Estado de arrastre
- zoomLevel: number        // Nivel de zoom (0.5 - 3.0)
```

#### Objeto Color Devuelto
```javascript
{
  hex: "#A67B5B",          // Código hexadecimal
  rgb: "rgb(166, 123, 91)", // Formato RGB string
  r: 166,                   // Canal rojo (0-255)
  g: 123,                   // Canal verde (0-255)
  b: 91,                    // Canal azul (0-255)
  a: 255                    // Canal alfa (0-255)
}
```

### Tecnologías Utilizadas

- **HTML5 Canvas**: Para renderizar y analizar la imagen
- **React Hooks**: useState, useRef, useEffect
- **Canvas API**: getImageData() para detección de color
- **Touch Events**: Soporte para dispositivos móviles
- **CSS Animations**: Animaciones del cuentagotas y modal

### Algoritmo de Detección de Color

```javascript
1. Cargar imagen en canvas
2. Redimensionar para ajustar al contenedor
3. Al mover el cursor/dedo:
   a. Obtener coordenadas (x, y)
   b. Usar getImageData(x, y, 1, 1)
   c. Extraer valores RGBA del pixel
   d. Convertir a formato HEX
   e. Actualizar UI en tiempo real
```

## 📱 Responsive Design

### Puntos de Quiebre

#### Desktop (> 768px)
- Modal ancho: 600px
- Canvas altura máxima: 50vh
- Layout horizontal para color preview

#### Tablet (768px)
- Modal ancho: 95vw
- Canvas altura máxima: 40vh
- Layout vertical para color preview

#### Móvil (480px)
- Modal ancho: 95vw
- Canvas altura máxima: 35vh
- Botones de tamaño completo
- Gotero más pequeño (24px)

### Optimizaciones Móviles

```css
@media (hover: none) and (pointer: coarse) {
  - Cursor: grab/grabbing
  - Touch-action: none
  - Gotero tamaño: 28px
  - Áreas de toque aumentadas
}
```

## 🎨 Personalización de Estilos

### Variables de Color (tema claro)
```css
- Background modal: white
- Text color: #2d3748
- Accent color: #667eea
- Border color: rgba(0,0,0,0.1)
```

### Variables de Color (tema oscuro)
```css
- Background modal: #2d3748
- Text color: white
- Accent color: #9f7aea
- Border color: rgba(255,255,255,0.1)
```

### Animaciones

#### FadeIn (overlay)
```css
Duration: 0.3s
From: opacity 0
To: opacity 1
```

#### SlideUp (modal)
```css
Duration: 0.4s
From: translateY(30px), opacity 0
To: translateY(0), opacity 1
```

#### Dropper Pulse (gotero)
```css
Duration: 1.5s infinite
From/To: scale(1)
Middle: scale(1.1)
```

## 🔌 Integración con Backend

### Ejemplo de Uso Completo

```javascript
import ColorPickerModal from './components/ColorPickerModal';

function MyComponent() {
  const [imageUrl, setImageUrl] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target.result);
      setShowPicker(true);
    };
    reader.readAsDataURL(file);
  };
  
  const handleColorConfirmed = async (color) => {
    // Enviar al backend
    const response = await fetch('/api/products/search-by-color/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hex: color.hex,
        rgb: { r: color.r, g: color.g, b: color.b }
      })
    });
    
    const products = await response.json();
    // Usar productos encontrados
  };
  
  return (
    <>
      <input type="file" onChange={handleImageUpload} />
      <ColorPickerModal
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        imageUrl={imageUrl}
        isDark={false}
        onColorConfirmed={handleColorConfirmed}
      />
    </>
  );
}
```

### Endpoint Backend Sugerido

```python
# Django REST Framework
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def search_by_color(request):
    hex_color = request.data.get('hex')
    rgb_color = request.data.get('rgb')
    
    # Convertir HEX a RGB si es necesario
    r, g, b = rgb_color['r'], rgb_color['g'], rgb_color['b']
    
    # Buscar productos con colores similares
    # Usando distancia euclidiana en el espacio RGB
    products = Product.objects.annotate(
        color_distance=Sqrt(
            Power(F('color_r') - r, 2) +
            Power(F('color_g') - g, 2) +
            Power(F('color_b') - b, 2)
        )
    ).filter(color_distance__lte=50).order_by('color_distance')
    
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)
```

## 🐛 Solución de Problemas

### La imagen no se carga
**Causa**: Formato de imagen no soportado  
**Solución**: Usar formatos JPG, PNG, o WebP

### El cuentagotas no se mueve
**Causa**: Canvas no está renderizado  
**Solución**: Verificar que `imageLoaded` sea true

### Colores incorrectos
**Causa**: Canvas está escalado pero las coordenadas no  
**Solución**: El componente ya maneja esto automáticamente

### No funciona en móvil
**Causa**: Eventos touch no están implementados  
**Solución**: El componente ya incluye touch events (onTouchStart, onTouchMove, onTouchEnd)

### El zoom no funciona
**Causa**: Límites de zoom alcanzados  
**Solución**: Rango permitido es 0.5x - 3.0x

## 🎯 Casos de Uso

### 1. Cliente quiere replicar un piso existente
1. Toma foto del piso actual
2. Selecciona el color exacto con el cuentagotas
3. Sistema busca pisos similares en catálogo

### 2. Arquitecto necesita color específico
1. Sube foto de referencia
2. Usa zoom para precisión
3. Obtiene código HEX para especificaciones

### 3. Comparación de muestras
1. Sube varias fotos
2. Extrae colores de cada una
3. Compara códigos HEX para matching exacto

## 📊 Rendimiento

### Métricas
- Tiempo de carga de imagen: < 500ms (depende del tamaño)
- Detección de color: < 16ms (60 FPS)
- Tamaño del componente: ~15KB (JS + CSS)

### Optimizaciones
- Redimensionamiento automático de imágenes grandes
- Throttling de eventos de movimiento
- Canvas solo se redibuja cuando es necesario
- CSS animations con GPU acceleration

## 🔐 Consideraciones de Privacidad

- Las imágenes se procesan **localmente** en el navegador
- No se envían imágenes al servidor automáticamente
- Solo se envían los valores de color (HEX/RGB)
- El usuario controla cuándo compartir la información

## 🚀 Próximas Mejoras

### Planificadas
- [ ] Historial de colores seleccionados
- [ ] Paleta de colores similar/complementaria
- [ ] Exportar colores a diferentes formatos (HSL, CMYK)
- [ ] Múltiples puntos de selección en una imagen
- [ ] Herramienta de promedio de color en área
- [ ] Comparación lado a lado de colores
- [ ] Guardar combinaciones de colores favoritas

### Avanzadas
- [ ] Detección automática de color dominante
- [ ] Segmentación de imagen por color
- [ ] Reconocimiento de patrones y texturas
- [ ] Integración con IA para sugerencias
- [ ] Modo de daltonismo para accesibilidad

## 📞 Soporte

Para problemas o preguntas sobre el selector de color:
1. Revisa esta documentación
2. Consulta el código fuente en `ColorPickerModal.jsx`
3. Verifica los estilos en `ColorPickerModal.css`
4. Contacta al equipo de desarrollo

---

**Versión**: 1.0.0  
**Fecha**: Octubre 2024  
**Autor**: Equipo de Desarrollo  
**Licencia**: Privado

