const { request, response } = require('express')
const { ObjectId } = require('mongoose').Types
const Usuario = require('../user/user.model')
const Category = require('../category/category.model')

const coleccionesPermitidas = ['usuarios', 'categorias', 'productos', 'roles']

const buscarUsuarios = async (termino = '', res = response) => {
  const esMongoId = ObjectId.isValid(termino)

  if (esMongoId) {
    const usuario = await Usuario.findById(termino)
    return res.json({
      results: usuario ? [usuario] : []
    })
  }

  const regex = new RegExp(termino, 'i')

  const usuarios = await Usuario.find({
    $or: [{ nombre: regex }, { correo: regex }],
    $and: [{ estado: true }]
  })

  res.json({
    results: usuarios
  })
}

const buscarCategorias = async (termino = '', res = response) => {
  const esMongoId = ObjectId.isValid(termino)

  if (esMongoId) {
    const categoria = await Category.findById(termino)
    return res.json({
      results: categoria ? [categoria] : []
    })
  }

  const regex = new RegExp(termino, 'i')

  const categorias = await Category.find({ nombre: regex, estado: true })

  res.json({
    results: categorias
  })
}

const buscar = (req = request, res = response) => {
  //eslint-disable-line
  const { coleccion, termino } = req.params

  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
    })
  }

  switch (coleccion) {
    case 'usuarios':
      buscarUsuarios(termino, res)
      break
    case 'categorias':
      buscarCategorias(termino, res)
      break
    default:
      res.status(500).json({
        msg: 'Se me olvido hacer esta busqueda'
      })
  }
}

module.exports = {
  buscar
}
