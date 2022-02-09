const { Router } = require('express')
const authenticate = require('../middleware/authenticate')
const Secret = require('../models/Secret.js')

module.exports = Router()
  .post('/', authenticate, async (req, res, next) => {
    try {
      const newSecret = await Secret.insert({...req.body, user_id: req.user.id})
      res.json(newSecret)
    } catch (error) {
      next(error)
    }
  })
  .get('/', authenticate, async (req, res, next) => {
      try {
        const secrets = await Secret.getAll()
        res.json(secrets)
      } catch (error) {
        next(error)
      }
    })