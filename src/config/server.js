const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/connection')
const fileUpload = require('express-fileupload')
const morgan = require('morgan')

class Server {
  constructor() {
    this.app = express()
    this.port = process.env.PORT
    // Rutas de mi aplicacion
    this.paths = {
      auth: '/api/auth',
      buscar: '/api/search',
      category: '/api/category',
      post: '/api/post',
      uploads: '/api/uploads',
      usuarios: '/api/users'
    }
    // this.usuariosPath = "/api/usuarios";
    // this.authPath = "/api/auth";

    // Morgan
    this.app.use(morgan('dev'))

    // Conectar a base de datos
    this.conectarDB()

    // Midelwares
    this.middleware()

    // rutas de mi aplicacion
    this.routes()

    // Directorio publico
    this.app.use(express.static('public'))
  }

  async conectarDB() {
    await dbConnection()
  }

  middleware() {
    // Directorio publico
    this.app.use(express.static('public'))
    // Lestura y parseo del codigo
    this.app.use(express.json())
    // CORS
    this.app.use(cors())
    // File upload- Carga de archivo
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/',
        createParentPath: true
      })
    )
  }

  routes() {
    this.app.use(this.paths.auth, require('../auth/auth.routes'))
    this.app.use(this.paths.buscar, require('../buscar/buscar.routes'))
    this.app.use(this.paths.category, require('../category/category.routes'))
    this.app.use(this.paths.post, require('../post/post.routes'))
    this.app.use(this.paths.uploads, require('../archivos/upload.routes'))
    this.app.use(this.paths.usuarios, require('../user/user.routes'))
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`servidor corriendo el puerto http://localhost:${ this.port }`)
    })
  }
}

module.exports = Server
