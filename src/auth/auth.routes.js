const { Router } = require('express')
const { check } = require('express-validator')

const { login, GoogleSignin, renewToken } = require('./auth.controller')
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt')

const router = Router()

router.post(
  '/login',
  [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
  ],
  login
)
router.post(
  '/google',
  [
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validarCampos
  ],
  GoogleSignin
)

router.get('/renew', validarJWT, renewToken)

module.exports = router
