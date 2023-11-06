// {
//     nombre:'romel',
//     correo:'dasda@SpeechGrammarList.com',
//     password:'32423432',
//     img:'adasdas',
//     rol:'12321',
//     estado:false,
//     google:false,
// }
const { Schema, model } = require('mongoose')

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio']
  },
  email: {
    type: String,
    required: [true, 'El correo es obligatorio'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatorio']
  },
  img: {
    type: String
  },
  role: {
    type: String,
    required: true,
    default: 'USER_ROLE',
    enum: ['ADMIN_ROLE', 'USER_ROLE', 'STREAMER_ROLE']
  },
  status: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  }
})

// Modificamos el json que nos devuelve mongoose
UserSchema.methods.toJSON = function () {
  const { __v, password, _id, ...user } = this.toObject(); //eslint-disable-line
  user.uid = _id
  return user
}

const User = model('User', UserSchema)
module.exports = User
