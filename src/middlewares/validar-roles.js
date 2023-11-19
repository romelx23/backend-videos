const { response, request } = require('express')

const esAdminRole = (req = request, res = response, next) => {
  if (!req.usuario) {
    return res.status(500).json({
      ok: false,
      msg: 'Se quiere verificar el role sin validar el token primero'
    })
  }
  console.log({ usuario: req.usuario });

  const { role, name } = req.usuario
  if (role !== 'ADMIN_ROLE') {
    return res.status(401).json({
      ok: false,
      msg: `${ name } no es administrador`
    })
  }

  next()
}

// rest operator vuelve arreglo lo que espera
const tieneRole = (...roles) => {
  return (req = request, res = response, next) => {
    if (!req.usuario) {

      console.log({ usuario: req.usuario });
      return res.status(500).json({
        ok: false,
        msg: 'Se quiere verificar el role sin validar el token primero'
      })
    }
    console.log({ usuario: req.usuario });

    if (!roles.includes(req.usuario.role)) {
      return res.status(401).json({
        ok: false,
        msg: `El servicio requiere uno de estos roles  ${ roles }`
      })
    }

    next()
  }
}

module.exports = {
  esAdminRole,
  tieneRole
}
