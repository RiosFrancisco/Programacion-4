const fs = require('fs');
const path = require('path');

const initializeFiles = () => {
  // Crear directorio de archivos de ejemplo
  const filesDir = path.join(__dirname, '../files');
  if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir);
    
    // Crear archivos de ejemplo
    fs.writeFileSync(
      path.join(filesDir, 'public.txt'), 
      'Este es un archivo público accesible para todos los usuarios.'
    );
    
    fs.writeFileSync(
      path.join(filesDir, 'readme.txt'), 
      'Bienvenido a la aplicación vulnerable.\n\nEsta aplicación contiene múltiples vulnerabilidades de seguridad con fines educativos.'
    );
    
    fs.writeFileSync(
      path.join(filesDir, 'config.txt'), 
      'Configuración de ejemplo:\nDATABASE_URL=mysql://root:password@localhost/db\nSECRET_KEY=supersecret123'
    );
  }
};

module.exports = {
  initializeFiles
};
