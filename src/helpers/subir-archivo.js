const extensiones = ['jpg', 'png', 'jpeg', 'gif']
const { v4: uuidv4 } = require('uuid')
const path = require('path')

const uploadFile = (files, extensionesValidas = extensiones, carpeta = '') => {
  return new Promise((resolve, reject) => {
    const archivo = files

    const nombreCortado = archivo.name.split('.')
    const extension = nombreCortado[nombreCortado.length - 1]

    // Validar la extension
    if (!extensionesValidas.includes(extension)) {
      return reject(`La extension ${ extension } no es permitida - ${ extensionesValidas }`)//eslint-disable-line
    }

    // res.json({extension});

    const nombreTemp = uuidv4() + '.' + extension
    const uploadPath = path.join(__dirname, './../uploads/', carpeta, nombreTemp)

    console.log(uploadPath)
    archivo.mv(uploadPath, (err) => {
      if (err) {
        reject(err)
      }
      resolve(nombreTemp)
    })
  })
}

module.exports = {
  uploadFile
}
