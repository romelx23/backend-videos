const { Schema, model } = require('mongoose')

const roleSchema = new Schema({
  rol: {
    type: String,
    required: [true, 'Rol es requerido']
  }
})

const Rol = model('Role', roleSchema)
module.exports = Rol
