const { Schema, model } = require('mongoose')

const CategorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    unique: true
  },
  status: {
    type: Boolean,
    default: true,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

CategorySchema.methods.toJSON = function () {
  const { __v, _id, status, ...category } = this.toObject(); //eslint-disable-line
  // category.uid = _id
  category._id = _id
  return category
}
const Category = model('Category', CategorySchema)
module.exports = Category
