const { Router } = require('express')
const { check } = require('express-validator')
const { coleccionesPermitidas } = require('../helpers')
const { validarCampos, validarArchivoSubir } = require('../middlewares')
const { cargarArchivos, actualizarImagen, mostrarImagen,actualizarImagenCloudinary } = require("./upload.controller");//eslint-disable-line
const router = Router()

router.post('/', validarArchivoSubir, cargarArchivos)

router.put('/:coleccion/:id', [
  validarArchivoSubir,
  check('id', 'No es un mongo ID').isMongoId(),
  check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
  validarCampos
], actualizarImagenCloudinary)

router.get('/:coleccion/:id', [
  check('id', 'No es un mongo ID').isMongoId(),
  check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
  validarCampos
], mostrarImagen)

module.exports = router
