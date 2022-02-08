const { Router } = require('express')
const authenticate = require('../middleware/authenticate')
const authorize = require('../middleware/authorize')
const Secret = require('../models/Secret.js')

module.exports = Router()
  .post('/', [authenticate, authorize], async (req, res, next) => {
    try {
      const secret = await Secret.create(req.body)
      res.json(secret)
    } catch (error) {
      next(error)
    }
  })