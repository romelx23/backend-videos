const { request, response } = require('express')
const Category = require('../category/category.model');
const Post = require('../post/post.model');

const createCategory = async (req = request, res = response) => {
  const name = req.body?.name?.toUpperCase()

  console.log({ user: req.usuario });
  console.log({ name });

  const categoryDB = await Category.findOne({ name })

  if (categoryDB) {
    return res.status(400).json({
      msg: `La Categoria ${ categoryDB.name }, ya existe`
    })
  }
  // generar la dataa guardar
  const data = {
    name,
    user: req.usuario._id
  }

  const category = new Category(data)

  // GuardarDB
  await category.save()
  return res.status(201).json(category)
}

// Obtener Categorias - paginados - total - populate

const getCategory = async (req = request, res = response) => {
  const { limit = 5, offset = 0, search = '' } = req.query

  const searchRegex = new RegExp(search, 'i')

  const query = {
    status: true,
    $or: [
      { name: { $regex: searchRegex } },
    ]
  }
  const [total, category] = await Promise.all([
    Category.countDocuments(query),
    Category.find(query)
      .populate('user', 'name')
      .skip(Number(offset))
      .limit(Number(limit))
  ])

  return res.status(200).json({
    total,
    categories: category
  })
}

// Obtener Categoria populate{} por id

const getCategoryById = async (req = request, res = response) => {
  const { id } = req.params
  try {
    const category = await Category.findById(id).populate('user', 'name')

    if (!category.status) {
      return res.status(401).json({
        ok: false,
        msg: 'categoria no encontrada'
      })
    }

    return res.status(200).json({
      ok: true,
      msg: 'get API - categoriaGet',
      category
    })
  } catch (error) {
    console.log(error)
    return res.status(401).json({
      ok: false,
      msg: 'categoria no encontrada'
    })
  }
}

// Actualizar Categoria

const updateCategory = async (req = request, res = response) => {
  // capturando query params
  const { id } = req.params

  const { status, user, ...data } = req.body; //eslint-disable-line

  console.log({ user: req.usuario });

  data.name = data.name.toUpperCase()
  const { name } = data
  data.user = req.usuario._id


  try {
    const categoryDB = await Category.findOne({ name })

    if (categoryDB) {
      return res.status(400).json({
        msg: `La Categoria ${ categoryDB.name }, ya existe`
      })
    }

    const category = await Category.findByIdAndUpdate(
      id,
      data,
      { new: true }
    ); //eslint-disable-line

    if (!category.status) {
      return res.status(401).json({
        ok: false,
        msg: 'categoria no encontrada',
        categoria: category
      })
    }

    return res.status(200).json({
      ok: true,
      msg: 'put API - categoriaPut',
      categoria: category
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Error al actualizar categoria'
    })
  }
}

// Borrar Categoria status :false

const deleteCategory = async (req = request, res = response) => {
  const { id } = req.params

  try {
    // const categoria = await Category.findByIdAndUpdate(
    //   id,
    //   { status: false },
    //   { new: true }
    // )

    // si la categoria esta asociada a un post, no se puede eliminar

    const post = await Post.find({ categories: { $in: [id] } })

    if (post.length > 0) {
      return res.status(401).json({
        ok: false,
        msg: 'La categoría no se puede eliminar, esta asociada a un video'
      })
    }

    const categoria = await Category.deleteOne({ _id: id }).exec();

    if (!categoria) {
      return res.status(401).json({
        ok: false,
        msg: 'categoria no encontrada'
      })
    }

    return res.status(200).json({
      categoria
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Error al eliminar categoria'
    })
  }
}

module.exports = {
  createCategory,
  getCategory,
  getCategoryById,
  updateCategory,
  deleteCategory
}
