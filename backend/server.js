const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { registerUser, loginUser } = require('./authController');
const { runColorExtractor } = require('./extractColors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Asegurar que la carpeta de uploads exista
const uploadsDir = path.join(__dirname, '../server/uploads/');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuración de multer para subir imágenes
const upload = multer({ dest: uploadsDir });

// Endpoint para extraer colores de una imagen
app.post('/api/extract-colors', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ninguna imagen.' });
    }
    const imagePath = req.file.path;
    const result = await runColorExtractor(imagePath);
    // Eliminar imagen temporal después de procesar
    fs.unlink(imagePath, () => {});
    res.json(result);
  } catch (err) {
    console.error('Error en /api/extract-colors:', err);
    res.status(500).json({ error: 'Error al extraer colores', details: err });
  }
});

// Registro
app.post('/api/register', (req, res) => {
  registerUser(req.body, (err, userId) => {
    if (err) {
      return res.status(400).json({ error: 'El correo ya está registrado.' });
    }
    res.json({ success: true, userId });
  });
});

// Login
app.post('/api/login', (req, res) => {
  loginUser(req.body, (err, user) => {
    if (err) return res.status(500).json({ error: 'Error en el servidor.' });
    if (!user) return res.status(401).json({ error: 'Credenciales incorrectas.' });
    res.json({ success: true, user });
  });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`);
});