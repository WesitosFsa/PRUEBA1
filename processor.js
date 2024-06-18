// processor.js
const cloudinary = require('cloudinary').v2;

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: 'your_cloud_name',
  api_key: 'your_api_key',
  api_secret: 'your_api_secret'
});

module.exports = {
  uploadImageToCloudinary: function (req, res, context, ee, next) {
    const imagePath = 'https://res.cloudinary.com/dlidac3hc/image/upload/v1718513201/Preguntas/gsvcicjzmeeofgwgiwmu.webp';  // Ruta de la imagen a cargar

    cloudinary.uploader.upload(imagePath, { folder: 'test_images' }, function(error, result) {
      if (error) {
        console.error('Error al subir la imagen a Cloudinary:', error);
        return next(new Error('Error al subir la imagen'));
      }
      context.vars.imageUrl = result.secure_url;  // Guarda la URL de la imagen en el contexto
      return next();
    });
  }
};
