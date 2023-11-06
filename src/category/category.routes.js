const { Router } = require('express')
const { check } = require('express-validator')
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares')
const {
  createCategory,
  getCategory,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('./category.controller')
const { existeCategoriaPorId } = require('../helpers/db-validators')
const router = Router()

// Obtener todas las cateogrias - publico
router.get('/', [], getCategory)

// Obtener una cateogria por id - publico
router.get('/:id', [
  validarJWT,
  esAdminRole,
  check('id', 'No es un mongo ID').isMongoId(),
  check('id').custom(existeCategoriaPorId),
  validarCampos
], getCategoryById)

// Crear categoria -privado -cualquiera persona con token valido
router.post(
  '/',
  [
    validarJWT,
    esAdminRole,
    check('name', 'El name es obligatorio').not().isEmpty(),
    validarCampos
  ],
  createCategory
)

// Actulaizar po id - privado-con token valido
router.put('/:id', [
  validarJWT,
  esAdminRole,
  check('name', 'El name es obligatorio').not().isEmpty(),
  check('id', 'No es un mongo ID').isMongoId(),
  check('id').custom(existeCategoriaPorId),
  validarCampos
], updateCategory)

// borrar cateogira-admin
router.delete('/:id', [
  validarJWT,
  esAdminRole,
  check('id').custom(existeCategoriaPorId),
  check('id', 'No es un mongo ID').isMongoId(),
  validarCampos
], deleteCategory)

module.exports = router
