const { response, request } = require('express')
const bcryptjs = require('bcryptjs')
const User = require('./user.model')

const getUsers = async (req = request, res = response) => {
  // const { q, nombre = "No name", apikey, page = 1, limit = 10 } = req.query;
  const { limit = 5, offset = 0 } = req.query
  // const query = { status: true }
  const query = {}

  // const users = await User.find(query)
  // .skip(Number(desde))
  // .limit(Number(limite));

  // console.log({ users });

  // const total=await Usuario.countDocuments(query);

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query)
      .skip(Number(offset))
      .limit(Number(limit))
  ])

  // console.log({ total, usuarios: users });

  return res.status(200).json({
    total,
    users
  })
}

const createUser = async (req, res = response) => {
  // leer y parsear del body que me envien
  const { name, email, password, role } = req.body
  try {

    // only user with ADMIN_ROLE can create USER

    const findUser = await User.findOne({ email });

    // if (role === 'USER_ROLE' && findUser.role !== 'ADMIN_ROLE') {
    //   return res.status(400).json({
    //     msg: "No tiene permisos para crear usuarios",
    //   });
    // }

    // const user = new User({ name, email, password, role: 'STREAMER_ROLE' })
    const user = new User({ name, email, password, role })


    // Verificar si el correo existe
    if (findUser) {
      return res.status(400).json({
        msg: "El correo ya esta registrado",
      });
    }

    // encriptar la contraseña
    const salt = bcryptjs.genSaltSync()
    user.password = bcryptjs.hashSync(password, salt)

    // Guardar en BD
    await user.save()

    return res.status(200).json({
      user
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      msg: 'Hable con el administrador'
    })
  }
}

const updateUserProfile = async (req = request, res = response) => {
  // capturando query params
  const { id } = req.params

  // const { _id, password, google, role, email, ...rest } = req.body; //eslint-disable-line
  const { _id, password, name } = req.body; //eslint-disable-line

  const rest = { name }
  console.log({ password, rest });

  try {
    // los user_role no pueden actualizar el perfil de los admin_role, pero si el suyo propio si lo actualizan

    const findUser = await User.findById(id);

    // console.log({ findUser });

    // if ((findUser.role === 'USER_ROLE' || findUser.role === 'STREAMER_ROLE') && findUser.role !== 'ADMIN_ROLE') {
    //   return res.status(400).json({
    //     ok: false,
    //     msg: "No tiene permisos para actualizar el perfil de un administrador",
    //   });
    // }

    // TODO validar contra bd
    if (password) {
      // encriptar la contraseña
      const salt = bcryptjs.genSaltSync()
      rest.password = bcryptjs.hashSync(password, salt)
    }

    const usuarioUpadted = await User.findByIdAndUpdate(id, rest, { new: true }); //eslint-disable-line

    return res.status(200).json({
      ok: true,
      msg: 'put API - usuarioPut',
      usuario: usuarioUpadted
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const updateUser = async (req = request, res = response) => {
  // capturando query params
  const { id } = req.params

  const { _id, password, google, email, ...rest } = req.body; //eslint-disable-line

  try {
    // TODO validar contra bd
    if (password) {
      // encriptar la contraseña
      const salt = bcryptjs.genSaltSync()
      rest.password = bcryptjs.hashSync(password, salt)
    }

    const usuario = await User.findByIdAndUpdate(id, rest, { new: true }); //eslint-disable-line

    return res.status(200).json({
      msg: 'put API - usuarioPut',
      usuario
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Hable con el administrador'
    })
  }
}

const patchUser = (req, res = response) => {
  res.json({
    msg: 'api patch'
  })
}

const deleteUser = async (req = request, res = response) => {
  const { id } = req.params

  // const uid=req.uid;
  // console.log(uid);

  //* Fisiacamente lo borramos
  //* const usuario=await Usuario.findByIdAndDelete(id);

  const usuario = await User.findByIdAndUpdate(id, { status: false }, { new: true })
  // const usuarioAutenticado=req.usuario;

  return res.status(200).json({
    ok: true,
    msg: 'delete API - usuarioDelete',
    usuario
  })
}

const updateStatusUser = async (req = request, res = response) => {
  const { id } = req.params
  const { status } = req.body

  console.log({ id, status })
  // const uid=req.uid;
  // console.log(uid);

  //* Fisiacamente lo borramos
  //* const usuario=await Usuario.findByIdAndDelete(id);

  try {
    const usuario = await User.findByIdAndUpdate(id, { status: status }, { new: true })
    // const usuarioAutenticado=req.usuario;

    return res.status(200).json({
      ok: true,
      msg: 'update status',
      usuario
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

module.exports = {
  getUsers,
  createUser,
  updateUser,
  updateUserProfile,
  updateStatusUser,
  patchUser,
  deleteUser
}
