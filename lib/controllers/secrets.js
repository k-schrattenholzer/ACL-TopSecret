const { Router } = require('express')
const authenticate = require('../middleware/authenticate')
const authorize = require('../middleware/authorize')
const Secret = require('../models/Secret.js')

module.exports = Router()
  .post('/', authenticate, async (req, res, next) => {
    try {
      const newSecret = await Secret.create({
        title: req.body.title, 
        description: req.body.description,
        user_id: req.body.user_id  
      })
      res.json(newSecret)
    } catch (error) {
      next(error)
    }
  })