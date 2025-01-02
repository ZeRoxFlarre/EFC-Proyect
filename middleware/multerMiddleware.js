import multer from 'multer';

// Configurar Multer para almacenar las imágenes en una carpeta específica
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images'); // Directorio donde se almacenarán las imágenes
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Usa el nombre original del archivo
  }
});

// Crea una instancia de multer con la configuración de almacenamiento
const upload = multer({ storage: storage });

// Exporta la instancia de multer para usarla en tus rutas
export { upload }; 
