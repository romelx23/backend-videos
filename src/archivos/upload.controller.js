const { response, request } = require('express')
const { subirArchivo } = require('../helpers')
const path = require('path')
const fs = require('fs')
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

const Usuario = require('../user/user.model')

const cargarArchivos = async (req = request, res = response) => {
  try {
    // Imagenes
    // const nombre = await subirArchivo(req.files, ["txt", "md"],"textos");
    const nombre = await subirArchivo(req.files, undefined, 'imgs')

    res.json({
      nombre
    })
  } catch (error) {
    res.status(400).json({
      msg: 'archivo no valido'
    })
  }
}

const actualizarImagen = async (req = request, res = response) => {
  const { id, coleccion } = req.params

  let modelo

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id)
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        })
      }

      break

    default:
      return res.status(500).json({
        msg: 'Se me olvido validar esto'
      })
  }

  // Limpiar Imagenes previas

  if (modelo.img) {
    // Ha que borrar la imagen del servidor

    const pathImagen = path.join(
      __dirname,
      '../uploads',
      coleccion,
      modelo.img
    )
    if (fs.existsSync(pathImagen)) {
      // borrar un archivo
      fs.unlinkSync(pathImagen)
    }
  }

  const nombre = await subirArchivo(req.files, undefined, coleccion)
  modelo.img = nombre
  await modelo.save()

  res.json({
    modelo
  })
}

const mostrarImagen = async (req, res = response) => {
  const { id, coleccion } = req.params

  let modelo

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id)
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        })
      }

      break

    default:
      return res.status(500).json({
        msg: 'Se me olvido validar esto'
      })
  }

  // Limpiar Imagenes previas

  if (modelo.img) {
    // Ha que borrar la imagen del servidor

    const pathImagen = path.join(
      __dirname,
      '../uploads',
      coleccion,
      modelo.img
    )
    if (fs.existsSync(pathImagen)) {
      return res.sendFile(pathImagen)
    }
  }

  const pathNoImage = path.join(__dirname, '../assets/no-image.jpg')

  res.sendFile(pathNoImage)
}

const actualizarImagenCloudinary = async (req = request, res = response) => {
  const { id, coleccion } = req.params

  let modelo

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id)
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        })
      }

      break

    default:
      return res.status(500).json({
        msg: 'Se me olvido validar esto'
      })
  }

  // Limpiar Imagenes previas

  if (modelo.img) {
    const nombreArr = modelo.img.split('/')
    const nombre = nombreArr[nombreArr.length - 1]
    const [publicId] = nombre.split('.')
    await cloudinary.uploader.destroy(publicId)
    console.log(publicId)
  }

  const { tempFilePath } = req.files.archivo

  const { secure_url: secureUrl } = await cloudinary.uploader.upload(tempFilePath)

  modelo.img = secureUrl
  await modelo.save()

  res.json({
    modelo
  })
}

module.exports = {
  cargarArchivos,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary
}
