const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

function runColorExtractor(imagePath) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve(__dirname, '../server/color_extractor.py');
    console.log('[ColorExtractor] Ejecutando:', 'python', scriptPath, imagePath);
    const pythonProcess = spawn('python', [scriptPath, imagePath]);
    let result = '';
    let error = '';

    pythonProcess.stdout.on('data', data => {
      console.log('[ColorExtractor] STDOUT:', data.toString());
      result += data.toString();
    });
    pythonProcess.stderr.on('data', data => {
      console.error('[ColorExtractor] STDERR:', data.toString());
      error += data.toString();
    });
    pythonProcess.on('close', code => {
      console.log('[ColorExtractor] Proceso cerrado con código:', code);
      if (code === 0) {
        try {
          resolve(JSON.parse(result));
        } catch (e) {
          console.error('[ColorExtractor] Error al parsear JSON:', result);
          reject({ error: 'Error al parsear resultado de Python', details: result });
        }
      } else {
        console.error('[ColorExtractor] Error:', error || result);
        reject({ error: error || result });
      }
    });
    pythonProcess.on('error', err => {
      console.error('[ColorExtractor] Error al ejecutar Python:', err);
      reject({ error: 'Error al ejecutar Python', details: err });
    });
  });
}

module.exports = { runColorExtractor };