const { response, request } = require('express')
const jwt = require('jsonwebtoken')
const Usuario = require('../user/user.model')

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header('x-token');
  // console.log({ token });

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: 'No hay token en la peticion'
    })
  }

  //*   console.log(token);
  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

    // console.log({ uid });
    // leer el usuario que corresponde al uid
    const usuario = await Usuario.findById(uid)

    if (!usuario) {
      return res.status(401).json({
        ok: false,
        msg: 'Token no valido - usuario no existe en BD'
      })
    }

    // Vertificar sui el uid tiene estado true
    if (!usuario.status) {
      // no tengo permisos status 401
      return res.status(401).json({
        ok: false,
        msg: 'Token no valido - usuario con estado : false'
      })
    }
    // req.uid=uid;
    // console.log({ usuario });
    req.usuario = usuario
    next()
  } catch (error) {
    console.log({ error });
    return res.status(401).json({
      ok: false,
      msg: 'Token no valido'
    })
  }
}

module.exports = {
  validarJWT
}
