const { Router } = require('express')
const { check } = require('express-validator')
const { existeCategoriaPorId, isArrayOfMongoIds, existCategoryIdInArray } = require('../helpers/db-validators')
const { validarCampos, validarJWT } = require('../middlewares')
const { getPosts, getPostId, postPost, putPost, deletePost, getPostIdByUser } = require('./post.controller')

const router = Router()

router.get('/', [], getPosts)

router.get('/id/:id', [], getPostId)

router.get('/user', [validarJWT, validarCampos], getPostIdByUser)

router.post('/', [
  validarJWT, // reconoce al usuario por medio del token y lo devuelve
  // check('category', 'No es un Mongo ID').isMongoId(),
  // check('category').custom(existeCategoriaPorId), 
  // check('categories').custom(isArrayOfMongoIds),
  // check('categories').custom(existCategoryIdInArray),
  validarCampos
], postPost)

router.put('/:id', [
  validarJWT,
  // check('categories').custom(isArrayOfMongoIds),
  // check('categories').custom(existCategoryIdInArray),
  validarCampos
], putPost)

router.delete('/:id', [validarJWT, validarCampos], deletePost)

module.exports = router
