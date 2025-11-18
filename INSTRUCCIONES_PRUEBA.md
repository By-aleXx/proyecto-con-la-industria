# 🧪 Instrucciones de Prueba - Selector de Color

## 🚀 Inicio Rápido

### 1. Instalar Dependencias
```bash
cd asistente-ventas
npm install
```

### 2. Iniciar la Aplicación
```bash
npm start
```

La app se abrirá automáticamente en `http://localhost:3000`

### 3. Iniciar Sesión
- Usuario de prueba (si tienes backend corriendo)
- O crear una cuenta nueva

---

## 🧪 Casos de Prueba

### ✅ Prueba 1: Subir Foto desde Galería (Desktop)

**Pasos:**
1. Navega al Menú Principal (`/menu`)
2. Haz clic en el botón de cámara 📸 (esquina inferior derecha)
3. En el diálogo, selecciona "Cancelar" o "OK" según tu preferencia
4. Selecciona una imagen de tu computadora (JPG, PNG)
5. Verifica que se abra el ColorPickerModal

**Resultado Esperado:**
- ✅ Modal se abre con la imagen
- ✅ Cuentagotas visible en el centro
- ✅ Controles de zoom visibles
- ✅ Botones Cancelar y Confirmar activos

---

### ✅ Prueba 2: Seleccionar Color con Mouse (Desktop)

**Pasos:**
1. Con el modal abierto
2. Mueve el cursor sobre diferentes partes de la imagen
3. Observa el cuentagotas 💧 seguir el cursor
4. Observa la sección "Color seleccionado" actualizarse

**Resultado Esperado:**
- ✅ Cuentagotas sigue el cursor suavemente
- ✅ Color HEX se actualiza en tiempo real
- ✅ Color RGB se actualiza correctamente
- ✅ Preview muestra el color seleccionado
- ✅ El color del swatch coincide con el área seleccionada

---

### ✅ Prueba 3: Usar Zoom

**Pasos:**
1. Con el modal abierto
2. Haz clic en 🔍+ varias veces
3. Observa la imagen acercarse (hasta 300%)
4. Haz clic en 🔍− para alejar
5. Intenta seleccionar un color con zoom activo

**Resultado Esperado:**
- ✅ Zoom aumenta hasta 300%
- ✅ Botón + se deshabilita en el máximo
- ✅ Zoom disminuye hasta 50%
- ✅ Botón − se deshabilita en el mínimo
- ✅ Porcentaje se muestra correctamente
- ✅ Selección de color funciona en cualquier nivel de zoom

---

### ✅ Prueba 4: Confirmar Color

**Pasos:**
1. Selecciona un color específico
2. Anota el código HEX mostrado
3. Haz clic en "Confirmar Color"
4. Observa el modal cerrarse
5. Verifica el preview en la esquina inferior derecha

**Resultado Esperado:**
- ✅ Modal se cierra
- ✅ Toast muestra mensaje de confirmación
- ✅ Preview muestra la imagen
- ✅ Preview muestra el color con código HEX
- ✅ El código HEX coincide con el seleccionado

---

### ✅ Prueba 5: Reabrir Selector

**Pasos:**
1. Con un color ya seleccionado
2. Haz clic en el preview del color (esquina inferior derecha)
3. Verifica que el modal se reabra

**Resultado Esperado:**
- ✅ Modal se abre nuevamente
- ✅ La misma imagen se muestra
- ✅ Puedes seleccionar un color diferente
- ✅ Al confirmar, el preview se actualiza

---

### ✅ Prueba 6: Cancelar Selección

**Pasos:**
1. Abre el modal con una imagen
2. Selecciona un color
3. Haz clic en "Cancelar"

**Resultado Esperado:**
- ✅ Modal se cierra
- ✅ No se guarda ningún color nuevo
- ✅ Preview anterior se mantiene (si había uno)
- ✅ No aparece toast de confirmación

---

### ✅ Prueba 7: Cerrar con X

**Pasos:**
1. Abre el modal
2. Haz clic en el botón X (esquina superior derecha)

**Resultado Esperado:**
- ✅ Modal se cierra
- ✅ Mismo comportamiento que "Cancelar"

---

### ✅ Prueba 8: Móvil - Touch (Prueba en dispositivo real o DevTools)

**Pasos:**
1. Abre Chrome DevTools (F12)
2. Activa modo responsive (Ctrl+Shift+M)
3. Selecciona un dispositivo móvil (ej. iPhone 12)
4. Sube una foto
5. Usa touch para arrastrar el cuentagotas

**Resultado Esperado:**
- ✅ Modal se adapta al tamaño de pantalla
- ✅ Layout cambia a vertical
- ✅ Touch funciona para arrastrar
- ✅ Zoom funciona con botones
- ✅ Todo es legible y usable

---

### ✅ Prueba 9: Tema Oscuro

**Pasos:**
1. En MainMenu, haz clic en el toggle de tema (⚙️)
2. Activa el tema oscuro
3. Abre el selector de color

**Resultado Esperado:**
- ✅ Modal tiene fondo oscuro
- ✅ Texto es blanco/claro
- ✅ Colores se ajustan correctamente
- ✅ Contraste es bueno
- ✅ Swatch es visible

---

### ✅ Prueba 10: Precisión de Color

**Pasos:**
1. Sube una imagen con colores sólidos conocidos
2. Selecciona un área roja pura
3. Verifica el código HEX

**Ejemplos para verificar:**
- Rojo puro: #FF0000 (rgb(255, 0, 0))
- Verde puro: #00FF00 (rgb(0, 255, 0))
- Azul puro: #0000FF (rgb(0, 0, 255))
- Negro: #000000 (rgb(0, 0, 0))
- Blanco: #FFFFFF (rgb(255, 255, 255))

**Resultado Esperado:**
- ✅ Códigos HEX son exactos
- ✅ Valores RGB coinciden
- ✅ Preview muestra el color correcto

---

## 🔍 Pruebas de Edge Cases

### Edge Case 1: Imagen Muy Grande
**Paso:** Sube una imagen de 5000x5000 px  
**Esperado:** Se redimensiona automáticamente para ajustar

### Edge Case 2: Imagen Muy Pequeña
**Paso:** Sube una imagen de 50x50 px  
**Esperado:** Se muestra pero pequeña, zoom ayuda

### Edge Case 3: Imagen Panorámica
**Paso:** Sube una imagen 4000x500 px  
**Esperado:** Se ajusta manteniendo aspect ratio

### Edge Case 4: Imagen Vertical
**Paso:** Sube una imagen 500x4000 px  
**Esperado:** Se ajusta manteniendo aspect ratio

### Edge Case 5: Múltiples Aperturas
**Paso:** Abre y cierra el modal 10 veces  
**Esperado:** No hay memory leaks, funciona normal

---

## 🐛 Pruebas de Errores

### Error 1: Sin Imagen
**Paso:** Intenta abrir modal sin imagen  
**Esperado:** No se abre o muestra mensaje

### Error 2: Archivo Inválido
**Paso:** Intenta subir un PDF o TXT  
**Esperado:** Se rechaza o muestra error

### Error 3: Imagen Corrupta
**Paso:** Intenta subir archivo .jpg corrupto  
**Esperado:** Muestra "Cargando..." indefinidamente o error

---

## 📱 Pruebas en Dispositivos Reales

### iOS (iPhone/iPad)
- [ ] Safari
- [ ] Chrome iOS
- [ ] Captura con cámara funciona
- [ ] Touch funciona suavemente
- [ ] Layout correcto

### Android
- [ ] Chrome
- [ ] Samsung Internet
- [ ] Firefox Mobile
- [ ] Captura con cámara funciona
- [ ] Touch responsivo

### Desktop
- [ ] Chrome (Windows)
- [ ] Firefox (Windows)
- [ ] Safari (macOS)
- [ ] Edge (Windows)
- [ ] Opera

---

## 📊 Checklist de Validación

### Funcionalidad
- [ ] Subir foto desde galería
- [ ] Tomar foto con cámara (en dispositivos compatibles)
- [ ] Arrastrar cuentagotas con mouse
- [ ] Arrastrar cuentagotas con touch
- [ ] Zoom in/out funciona
- [ ] Detección de color es precisa
- [ ] Preview HEX correcto
- [ ] Preview RGB correcto
- [ ] Confirmar color guarda correctamente
- [ ] Cancelar descarta cambios
- [ ] Reabrir modal funciona
- [ ] Limpiar imagen/color funciona

### UI/UX
- [ ] Modal se centra correctamente
- [ ] Animaciones son suaves
- [ ] Botones son responsivos
- [ ] Texto es legible
- [ ] Colores contrastan bien
- [ ] Loading states son claros
- [ ] Instrucciones son útiles

### Responsive
- [ ] Desktop > 768px
- [ ] Tablet 768px
- [ ] Móvil 480px
- [ ] Móvil pequeño < 480px
- [ ] Landscape vs Portrait

### Performance
- [ ] Modal abre en < 200ms
- [ ] Detección color < 16ms
- [ ] Sin lag al arrastrar
- [ ] Zoom es fluido
- [ ] Sin memory leaks

### Accesibilidad
- [ ] Puede cerrarse con X
- [ ] Puede cerrarse con Cancelar
- [ ] Botones tienen cursor pointer
- [ ] Disabled states visibles
- [ ] Contraste de colores adecuado

---

## 🎯 Criterios de Aceptación

### ✅ Aprobado Si:
1. ✅ Puedes subir/tomar fotos
2. ✅ El cuentagotas se mueve suavemente
3. ✅ Los colores detectados son precisos
4. ✅ El zoom funciona correctamente
5. ✅ Funciona en móvil y desktop
6. ✅ Los temas claro/oscuro funcionan
7. ✅ No hay errores en consola
8. ✅ El color confirmado se guarda

### ❌ Rechazar Si:
1. ❌ El cuentagotas no se mueve
2. ❌ Los colores son incorrectos
3. ❌ El modal no se cierra
4. ❌ Hay errores de JavaScript
5. ❌ No funciona en móvil
6. ❌ El layout está roto
7. ❌ No se puede confirmar el color

---

## 🔧 Troubleshooting Durante Pruebas

### Problema: Modal no se abre
**Solución:** 
```bash
# Verifica la consola
# Asegúrate de que la imagen se cargó
console.log(selectedImage); // Debe tener data:image/...
```

### Problema: Cuentagotas no detecta color
**Solución:**
```bash
# Verifica que imageLoaded sea true
# Verifica que el canvas tenga contenido
# Inspecciona el elemento canvas en DevTools
```

### Problema: Errores en consola
**Solución:**
```bash
# Limpia cache
Ctrl+Shift+R (Windows)
Cmd+Shift+R (Mac)

# Reinstala dependencias
rm -rf node_modules
npm install
npm start
```

---

## 📝 Reporte de Pruebas

### Plantilla de Reporte

```
Fecha: [DD/MM/YYYY]
Probador: [Nombre]
Dispositivo: [Windows/Mac/iPhone/Android]
Navegador: [Chrome/Firefox/Safari/Edge]
Versión: [xx.x]

PRUEBAS REALIZADAS:
☐ Prueba 1: [Pasó/Falló] - [Comentarios]
☐ Prueba 2: [Pasó/Falló] - [Comentarios]
...

BUGS ENCONTRADOS:
1. [Descripción del bug]
   - Pasos para reproducir
   - Resultado esperado
   - Resultado actual
   - Capturas de pantalla

COMENTARIOS GENERALES:
[Feedback sobre UX, rendimiento, etc.]

APROBACIÓN:
[ ] APROBADO
[ ] RECHAZADO - Requiere correcciones
```

---

## 🎉 Prueba Final - Demo Completo

### Escenario: Cliente busca piso por color

**Historia:**
Un cliente entra a la tienda con una foto de un piso que le gusta. Quiere encontrar pisos similares en el catálogo.

**Pasos:**
1. Login como vendedor
2. Ir a MainMenu
3. Click en botón cámara 📸
4. Subir foto del cliente
5. Arrastrar cuentagotas sobre el piso
6. Ajustar zoom si es necesario
7. Confirmar el color deseado
8. Ver el código HEX seleccionado
9. [Futuro: Buscar en catálogo con ese color]

**Demo exitosa si:**
- ✅ Todo fluye naturalmente
- ✅ El vendedor puede hacerlo en < 30 segundos
- ✅ El color detectado es preciso
- ✅ La interfaz es intuitiva
- ✅ No hay confusión en ningún paso

---

## 📞 Siguiente Paso

Una vez completadas todas las pruebas:
1. ✅ Documenta resultados
2. ✅ Corrige bugs encontrados
3. ✅ Implementa integración con backend
4. ✅ Despliegue a producción

---

**¡Buena suerte con las pruebas!** 🧪✨

