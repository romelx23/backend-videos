const { Router } = require('express')
const { body, check } = require('express-validator')

const {
  getUsers,
  createUser,
  updateUser,
  patchUser,
  deleteUser,
  updateUserProfile,
  updateStatusUser
} = require('./user.controller')
const {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId
} = require('../helpers/db-validators')
// const { validarCampos } = require("../middlewares/validar-campos");
// const { validarJWT } = require("../middlewares/validar-jwt");
// const { tieneRole } = require("../middlewares/validar-roles");

const { validarJWT, tieneRole, validarCampos, esAdminRole } = require('../middlewares')

const router = Router()

router.get('/', [validarJWT, esAdminRole], getUsers)

router.put(
  '/:id',
  [
    validarJWT,
    esAdminRole,
    check('id', 'No es un mongo ID').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    // check('role').custom(esRoleValido),
    body('role', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE', 'STREAMER_ROLE']),
    validarCampos
  ],
  updateUser
)

router.put(
  '/profile/:id',
  [
    validarJWT,
    // esAdminRole,
    check('id', 'No es un mongo ID').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    // check('name', 'El nombre es obligatorio').not().isEmpty(),
    // check('role').custom(esRoleValido),
    // body('role', 'No es un rol valido').isIn(['USER_ROLE', 'STREAMER_ROLE', 'ADMIN_ROLE']),
    validarCampos
  ],
  updateUserProfile
)

router.post(
  '/',
  [
    validarJWT,
    esAdminRole,
    body('name', 'El nombre es obligatorio').not().isEmpty(),
    body('password', 'El password debe de ser más de 6 letras').isLength({
      min: 6
    }),
    body('email', 'El correo no es valido').isEmail().custom(emailExiste),
    // body('rol').custom(esRoleValido),
    body('role', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE', 'STREAMER_ROLE']),
    validarCampos
  ],
  createUser
)

router.delete(
  '/:id',
  [
    validarJWT,
    esAdminRole,
    tieneRole('ADMIN_ROLE', 'USER_ROLE'),
    check('id', 'No es un mongo ID').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
  ],
  deleteUser
)

router.patch('/:id',
  [
    validarJWT,
    esAdminRole,
    tieneRole('ADMIN_ROLE', 'USER_ROLE'),
    check('id', 'No es un mongo ID').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('status', 'El status es obligatorio').not().isEmpty(),
    validarCampos
  ],
  updateStatusUser
)

router.patch('/', patchUser)

module.exports = router
