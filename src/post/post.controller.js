const { request, response } = require('express')
const Post = require('./post.model')
const { uploadFile } = require('../helpers')
const { uploadImageToCloudinary, deleteImageFromCloudinary } = require('../helpers/upload-file')
const User = require('../user/user.model')
const { updatePostSchema } = require('./post.schema')

const getPosts = async (req = request, res = response) => {
  const { limit = 5, offset = 0, search = '', startDate = '', category = '', slug = '' } = req.query
  console.log({ limit, offset, search, startDate, category, slug });

  let startDateFilter = {};  // Este objeto almacenará la parte de la consulta para la fecha

  if (startDate) {
    const parsedStartDate = new Date(startDate);

    if (!isNaN(parsedStartDate)) {
      console.log({ parsedStartDate });
      startDateFilter = {
        createdAt: { $gte: parsedStartDate }
      };
    }
  }
  let user = {}
  if (slug !== '') user = await User.findOne({ _id: slug });

  const query = {
    status: true,
    $or: [
      { title: { $regex: new RegExp(search, 'i') } },
      { description: { $regex: new RegExp(search, 'i') } },
    ],
    ...startDateFilter
  }

  if (category !== '') {
    console.log({ category });
    query.categories = category;
  }

  if (user) {
    query.user = user._id;
  }

  try {
    const [total, post] = await Promise.all([
      Post.countDocuments(query),
      Post.find(query)
        .skip(Number(offset))
        .limit(Number(limit))
        .populate('categories', 'name')
        .populate('user', 'name')
    ])
    return res.status(200).json({
      total,
      videos: post
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      msg: 'Hable con el administrador'
    })
  }
}

const getPostId = async (req = request, res = response) => {
  const { id } = req.params
  try {
    const post = await Post.findById(id)
      .populate('categories', 'name')
      .populate('user', 'name')

    if (!post.status) {
      return res.status(401).json({
        msg: 'producto no encontrada'
      })
    }
    res.status(200).json({
      post
    })
  } catch (error) {
    res.status(500).json({
      msg: 'Hable con el administrador'
    })
    console.log(error)
  }
}

// endpoitn para traer los post de un usuario, y si admin, traer todos los post
const getPostIdByUser = async (req = request, res = response) => {
  const usuario = req.usuario;
  // console.log({ usuario });
  // const userId = usuario._id;

  const { limit = 5, offset = 0, search = '' } = req.query;
  const query = {
    status: true,
    $or: [
      { title: { $regex: new RegExp(search, 'i') } },
      { description: { $regex: new RegExp(search, 'i') } }
    ]
  }

  const postByIdTotal = await Post.find({
    user: usuario._id,
    status: true,
  })
  // console.log({ postTotal: postTotal.length });

  try {
    // const user = await User.findById(userId);

    const postById = await Post.find({
      user: usuario._id,
      status: true,
      $or: [
        { title: { $regex: new RegExp(search, 'i') } },
        { description: { $regex: new RegExp(search, 'i') } }
      ]
    })
      .skip(Number(offset))
      .limit(Number(limit))
      .populate('categories', ['name', '_id'])
      .populate('user', ['name', '_id'])

    // if (!postById.status) {
    //   return res.status(401).json({
    //     ok: false,
    //     msg: 'producto no encontrada'
    //   })
    // }

    // if (!user) {
    //   console.log({ user });
    //   return res.status(401).json({
    //     ok: false,
    //     msg: 'usuario no encontrado'
    //   })
    // }

    // si el usuario es admin, traer todos los post
    if (usuario.role === 'ADMIN_ROLE') {
      const postTotal = await Post.find();
      const post = await Post.find(query)
        .skip(Number(offset))
        .limit(Number(limit))
        .populate('categories', ['name', '_id'])
        .populate('user', ['name', '_id'])
      // console.log({ post });
      return res.status(200).json({
        ok: true,
        videos: post,
        total: postTotal.length,
      })
    }

    // console.log({ postById });

    return res.status(200).json({
      ok: true,
      videos: postById,
      total: postByIdTotal.length,
    })
  } catch (error) {
    console.log({ error })
    return res.status(500).json({
      msg: 'Hable con el administrador'
    })
  }
}

const postPost = async (req = request, res = response) => {
  const { status, user, ...body } = req.body
  // const { title } = body
  // si el post ya existe en bd
  // const postDb = Post.findOne({ title })
  // console.log(postDb)
  // if (postDb) {
  //   return res.status(400).json({
  //     msg: `El post ${postDb.title}, ya existe`
  //   })
  // }

  const file = req?.files?.image

  console.log({ body });
  console.log({ file });

  if (!file) {
    return res.status(400).json({
      ok: false,
      msg: 'No hay archivos en la petición'
    })
  }

  // category is array of object categories, convert to array of ids
  const cleanedJsonString = body.categories.replace(/^'|'$/g, '');
  const categoryParse = JSON.parse(cleanedJsonString);
  const categoryIds = categoryParse.map(category => category._id);

  try {

    const image = await uploadImageToCloudinary(file.tempFilePath, 'front-posts')
    console.log({ image });

    // console.log(body)
    const data = {
      ...body,
      img: {
        url: image?.url,
        public_id: image?.id
      },
      categories: categoryIds,
      user: req.usuario._id
    }
    const post = new Post(data)
    console.log({ post });
    // guardar en BD
    await post.save()
    return res.status(201).json({
      ok: true,
      msg: 'post creado',
      post
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const putPost = async (req = request, res = response) => {

  const postId = req.params.id; // Obtén el ID del post de los parámetros de la ruta
  const { status, user, ...body } = req.body;

  const { error, value } = updatePostSchema.validate(req.body);
  console.log({ error, value });

  // const categories = JSON.parse(body.categories).map(category => category._id);
  // console.log({ categories });
  const cleanedJsonString = body.categories.replace(/^'|'$/g, '');
  const categoryParse = JSON.parse(cleanedJsonString);
  const categoryIds = categoryParse.map(category => category._id);
  console.log({ categoryIds });
  console.log({ bodyParse: categoryParse });
  // console.log(JSON.parse(body.categories)[0]);

  // if (error) {
  //   return res.status(400).json({
  //     ok: false,
  //     msg: error.details[0].message,
  //   });
  // }


  // Verifica si existe el post con el ID proporcionado
  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({
      ok: false,
      msg: `El post con ID ${ postId } no existe`,
    });
  }

  try {
    const file = req?.files?.image;
    let imageUpdated = {
      url: "",
      public_id: "",
    }

    // Si hay un archivo, actualiza la imagen en Cloudinary
    if (file) {
      const image = await uploadImageToCloudinary(file.tempFilePath, 'front-posts');
      imageUpdated = {
        url: image?.url,
        public_id: image?.id,
      };
    }

    const postImage = await Post.findById(postId);

    // console.log({ postImage });

    // Si hay una imagen anterior, y no me envían una nueva, no la elimines
    if (postImage.img.url && !file) {
      imageUpdated = postImage.img;
    }

    // Actualiza los demás campos del post
    const postUpdated = await Post.findByIdAndUpdate(postId, {
      ...body,
      categories: categoryIds,
      img: imageUpdated,
    }, { new: true });

    // console.log({ postUpdated });

    return res.status(200).json({
      ok: true,
      msg: 'Post actualizado',
      post,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }

}

const deletePost = async (req = request, res = response) => {

  const { id } = req.params;

  // if post exist

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        ok: false,
        msg: `El post con ID ${ id } no existe`,
      });
    }

    //* Fisiacamente lo borramos

    const { public_id } = post.img;

    // delete image from cloudinary

    const deleteImage = await deleteImageFromCloudinary(public_id);

    const postDeleted = Post.deleteOne({ _id: id }).exec();
    console.log({ post });
    if (postDeleted.deletedCount === 1) {
      console.log('Documento eliminado con éxito');
    } else {
      console.log('No se encontró el documento a eliminar');
    }

    return res.status(200).json({
      ok: true,
      msg: 'delete API - usuarioDelete',
      id,
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
  getPosts,
  getPostId,
  getPostIdByUser,
  postPost,
  putPost,
  deletePost
}
