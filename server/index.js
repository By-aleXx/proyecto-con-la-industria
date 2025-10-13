const express = require('express');
const multer = require('multer');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const cors = require('cors');

const app = express();
// Configurar CORS
app.use(cors({
    origin: 'http://localhost:3000', // Permitir solo el frontend
    methods: ['GET', 'POST']
}));

app.use(express.json());

// Base de datos temporal para usuarios
const users = [
  {
    id: 1,
    email: 'usuario@ejemplo.com',
    password: '123456',
    userName: 'Usuario Demo'
  }
];

// Endpoint de registro
app.post('/api/register', (req, res) => {
  const { username, email, password, phone, birthdate, branch } = req.body;

  // Validar campos requeridos
  if (!username || !email || !password || !phone) {
    return res.status(400).json({
      success: false,
      error: 'Por favor, completa todos los campos requeridos'
    });
  }

  // Verificar si el usuario ya existe
  if (users.find(u => u.email === email)) {
    return res.status(400).json({
      success: false,
      error: 'El correo electrónico ya está registrado'
    });
  }

  // Crear nuevo usuario
  const newUser = {
    id: users.length + 1,
    email,
    password,
    userName: username,
    phone,
    birthdate,
    branch
  };

  users.push(newUser);

  res.json({
    success: true,
    message: '¡Registro exitoso!'
  });
});

// Endpoint de login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Validar que se proporcionaron las credenciales
  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      error: 'Por favor proporciona email y contraseña' 
    });
  }

  // Buscar el usuario
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    res.json({
      success: true,
      userName: user.userName
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Credenciales incorrectas'
    });
  }
});

// Configurar multer para manejo de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)){
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Endpoint para extraer colores de una imagen
app.post('/api/extract-colors', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ninguna imagen' });
  }

  const imagePath = req.file.path;
  
  // Ejecutar el script de Python para extraer colores
  const pythonScript = path.join(__dirname, 'color_extractor.py');
  
  // Ejecutar el script de Python para extraer colores
  const pythonProcess = spawn(process.platform === 'win32' ? 'python' : 'python3', [
    pythonScript,
    imagePath
  ]);

  let result = '';
  let error = '';

  pythonProcess.stdout.on('data', (data) => {
    result += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    error += data.toString();
  });

  pythonProcess.on('close', (code) => {
    // Eliminar la imagen después de procesarla
    fs.unlink(imagePath, (err) => {
      if (err) console.error('Error al eliminar la imagen:', err);
    });

    if (code !== 0) {
      console.error('Error en el proceso de Python:', error);
      return res.status(500).json({ error: 'Error al procesar la imagen' });
    }

    try {
      const colors = JSON.parse(result);
      if (colors.error) {
        return res.status(500).json({ error: colors.error });
      }
      res.json(colors);
    } catch (e) {
      console.error('Error al parsear el resultado:', e);
      res.status(500).json({ error: 'Error al procesar los colores' });
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});