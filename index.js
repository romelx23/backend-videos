const Server = require('./src/config/server')

require('dotenv').config();

const server = new Server()

server.listen()
