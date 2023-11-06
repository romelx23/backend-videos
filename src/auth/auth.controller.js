const { request, response } = require('express')

const User = require('../user/user.model')
const bcryptjs = require('bcryptjs')
const { generarJWT } = require('../helpers/generar-jwt')
const { googleVerify } = require('../helpers/google-verify')

const login = async (req = request, res = response) => {
  const { email, password } = req.body

  try {
    // Verificar si el email Existe
    console.log({ email, password });

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: 'Usuario /Password no son correctos-email'
      })
    }

    // Si el usuario esta activo

    if (!user.status) {
      return res.status(400).json({
        ok: false,
        msg: 'Usuario /Password no son correctos-status:false'
      })
    }

    console.log({ status: user.status });

    // Verificar la contraseña

    const validarPassword = bcryptjs.compareSync(password, user.password);

    console.log({ validarPassword });

    if (!validarPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Usuario /Password no son correctos-password'
      })
    }

    // Generar el JWT
    const token = await generarJWT(user.id)

    return res.status(200).json({
      ok: true,
      msg: 'Login ok',
      usuario: user,
      token
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el admnistrador'
    })
  }
}

// Google SignIn

const GoogleSignin = async (req = request, res = response) => {
  const { id_token: idToken } = req.body
  const { email, nombre, img } = await googleVerify(idToken)

  let usuario = await User.findOne({ email })

  try {
    if (!usuario) {
      // Tengo que crearlo
      const data = {
        nombre,
        email,
        password: ':P',
        img,
        google: true
      }

      usuario = new User(data)
      await usuario.save()
    }

    // Si el usuario en DB
    if (!usuario.estado) {
      return res.status(401).json({
        msg: 'Hable con el admnistrador, usuario bloqueado'
      })
    }

    // Generar el JWT
    const token = await generarJWT(usuario.id)

    res.json({
      usuario,
      token
    })
  } catch (error) {
    res.status(401).json({
      msg: 'token de Google no es valido'
    })
  }
}

const renewToken = async (req = request, res = response) => {
  const { usuario } = req

  if (!usuario.status) {
    return res.status(401).json({
      msg: 'Hable con el admnistrador, usuario bloqueado'
    })
  }

  // Generar el JWT
  const token = await generarJWT(usuario.id)

  return res.status(200).json({
    ok: true,
    msg: 'Renew',
    user: usuario,
    token
  })
}

module.exports = {
  login,
  GoogleSignin,
  renewToken
}
