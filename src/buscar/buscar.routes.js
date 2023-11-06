const { Router } = require('express')
const { buscar } = require('./buscar.controller')

const router = Router()

router.get('/:coleccion/:termino', buscar)

module.exports = router
