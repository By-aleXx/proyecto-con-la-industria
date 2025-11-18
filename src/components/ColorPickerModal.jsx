import React, { useState, useRef, useEffect, useCallback } from 'react';
import '../estilos/ColorPickerModal.css';

const ColorPickerModal = ({ isOpen, onClose, imageUrl, isDark, onColorConfirmed }) => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  
  const [selectedColor, setSelectedColor] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  

  const drawImageOnCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !imageRef.current || !container) return;

    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    // Calcular dimensiones para que la imagen quepa en el contenedor
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight - 200; // Espacio para controles
    
    const imgAspect = img.width / img.height;
    const containerAspect = containerWidth / containerHeight;
    
    let drawWidth, drawHeight;
    
    if (imgAspect > containerAspect) {
      drawWidth = containerWidth * 0.9;
      drawHeight = drawWidth / imgAspect;
    } else {
      drawHeight = containerHeight * 0.9;
      drawWidth = drawHeight * imgAspect;
    }

    canvas.width = drawWidth;
    canvas.height = drawHeight;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }, []);

  const getColorAtPosition = useCallback((x, y) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(x, y, 1, 1);
    const [r, g, b, a] = imageData.data;
    
    return {
      rgb: `rgb(${r}, ${g}, ${b})`,
      hex: rgbToHex(r, g, b),
      r, g, b, a
    };
  }, []);

  const rgbToHex = (r, g, b) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  const updateColorAtPosition = useCallback((x, y) => {
    const color = getColorAtPosition(Math.round(x), Math.round(y));
    if (color) {
      setSelectedColor(color);
    }
  }, [getColorAtPosition]);

  // Cargar imagen cuando se abre
  useEffect(() => {
    if (!(isOpen && imageUrl)) return;
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      drawImageOnCanvas();
      setImageLoaded(true);
      const canvas = canvasRef.current;
      if (canvas) {
        updateColorAtPosition(canvas.width / 2, canvas.height / 2);
      }
    };
    img.src = imageUrl;
  }, [isOpen, imageUrl, drawImageOnCanvas, updateColorAtPosition]);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    // Ajustar coordenadas según el zoom
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Verificar si está dentro del canvas
    if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
      setIsDragging(true);
      updateColorAtPosition(x, y);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    // Ajustar coordenadas según el zoom
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    let x = (e.clientX - rect.left) * scaleX;
    let y = (e.clientY - rect.top) * scaleY;

    // Limitar el movimiento dentro del canvas
    x = Math.max(0, Math.min(x, canvas.width));
    y = Math.max(0, Math.min(y, canvas.height));

    updateColorAtPosition(x, y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Soporte para touch (móvil)
  const handleTouchStart = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    // Ajustar coordenadas según el zoom
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (touch.clientX - rect.left) * scaleX;
    const y = (touch.clientY - rect.top) * scaleY;

    if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
      setIsDragging(true);
      updateColorAtPosition(x, y);
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    // Ajustar coordenadas según el zoom
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    let x = (touch.clientX - rect.left) * scaleX;
    let y = (touch.clientY - rect.top) * scaleY;

    x = Math.max(0, Math.min(x, canvas.width));
    y = Math.max(0, Math.min(y, canvas.height));

    updateColorAtPosition(x, y);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleConfirm = () => {
    if (selectedColor) {
      onColorConfirmed(selectedColor);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedColor(null);
    setImageLoaded(false);
    setZoomLevel(1);
    onClose();
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  useEffect(() => {
    if (imageLoaded) {
      drawImageOnCanvas();
    }
  }, [zoomLevel, imageLoaded, drawImageOnCanvas]);

  if (!isOpen) return null;

  return (
    <div className={`color-picker-overlay ${isDark ? 'dark' : 'light'}`}>
      <div className="color-picker-modal" ref={containerRef}>
        {/* Header */}
        <div className="color-picker-header">
          <h2>Selecciona el color del piso</h2>
          <button className="close-button" onClick={handleClose}>✕</button>
        </div>

        {/* Body scrollable */}
        <div className="modal-body">
          {/* Canvas Container */}
          <div className="canvas-container">
          {!imageLoaded && (
            <div className="loading-message">Cargando imagen...</div>
          )}
          <canvas
            ref={canvasRef}
            className="color-canvas"
            style={{
              cursor: isDragging ? 'grabbing' : 'crosshair',
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'center center'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
          </div>

          {/* Zoom Controls */}
          <div className="zoom-controls">
            <button onClick={handleZoomOut} disabled={zoomLevel <= 0.5}>
              🔍−
            </button>
            <span className="zoom-level">{Math.round(zoomLevel * 100)}%</span>
            <button onClick={handleZoomIn} disabled={zoomLevel >= 3}>
              🔍+
            </button>
          </div>

          {/* Color Preview */}
          {selectedColor && (
            <div className="color-preview-section">
              <div className="color-info">
                <div className="color-label">Color seleccionado:</div>
                <div className="color-details">
                  <div
                    className="color-swatch"
                    style={{ backgroundColor: selectedColor.hex }}
                  ></div>
                  <div className="color-values">
                    <div className="color-value">
                      <strong>HEX:</strong> {selectedColor.hex}
                    </div>
                    <div className="color-value">
                      <strong>RGB:</strong> {selectedColor.rgb}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="instructions">
            <p>📱 Haz clic o arrastra sobre la imagen para seleccionar un color</p>
            <p>🔍 Usa los botones de zoom para ver detalles</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            className="btn-cancel"
            onClick={handleClose}
          >
            Cancelar
          </button>
          <button
            className="btn-confirm"
            onClick={handleConfirm}
            disabled={!selectedColor}
          >
            Confirmar Color
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorPickerModal;

