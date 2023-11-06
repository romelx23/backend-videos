const { isValidObjectId } = require('mongoose')
const Category = require('../category/category.model')
const Role = require('../rol/rol.models')
const User = require('../user/user.model')

const esRoleValido = async (rol = '') => {
  const existeRol = await Role.findOne({ rol })

  if (!existeRol) {
    throw new Error(`El rol ${ rol } no esta registrado`)
  }
}

const emailExiste = async (correo = '') => {
  const existeEmail = await User.findOne({ correo })
  if (existeEmail) {
    throw new Error(`El correo ${ correo } ya está registrado`)
  }
}

const existeUsuarioPorId = async (id) => {
  // Verificar si el usuario existe
  const existeUsuario = await User.findById(id)
  if (!existeUsuario) {
    throw new Error(`El id: ${ id } no esta registrado`)
  }
}

const existeCategoriaPorId = async (id) => {
  // Verificar si la categoria existe
  const existeCategoria = await Category.findById(id)
  if (!existeCategoria) {
    throw new Error(`El id: ${ id } no esta registrado`)
  }
}

const isArrayOfMongoIds = (array = '') => {
  // const isArrayOfMongoIds = array.every(id => isValidObjectId(id))
  const cleanedJsonString = body.categories.replace(/^'|'$/g, '');
  const categoryParse = JSON.parse(cleanedJsonString);
  const categoryIds = categoryParse.map(category => category.uid);

  if (!categoryIds.every(id => isValidObjectId(id))) {
    throw new Error(`No es un array de Mongo Ids`)
  }
  return true
}

const existCategoryIdInArray = async (array = '') => {
  // const categories = await Category.find({ _id: { $in: array } })

  const cleanedJsonString = body.categories.replace(/^'|'$/g, '');
  const categoryParse = JSON.parse(cleanedJsonString);
  const categoryIds = categoryParse.map(category => category.uid);

  if (!categoryIds.every(id => isValidObjectId(id))) {
    // if (categories.length !== array.length) {
    throw new Error(`No es un array de Mongo Ids`)
  }
  return true
}

/**
 * Validar colecciones permitidas
 */

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
  const incluida = colecciones.includes(coleccion)
  if (!incluida) {
    throw new Error(
      `La coleccion ${ coleccion } no es permitida, ${ colecciones }`
    )
  }
  return true
}

module.exports = {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
  existeCategoriaPorId,
  coleccionesPermitidas,
  isArrayOfMongoIds,
  existCategoryIdInArray
}
