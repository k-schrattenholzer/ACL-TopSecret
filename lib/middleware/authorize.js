const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
  try {
    const email = req.user.email
    const secret = 'admin'
    if (email === secret) {
      next()
    } else {
      throw new Error('user is not admin')
    }
  } catch (error) {
    console.error(error)
    error.message = "You do not have access to view this page"
    error.status = 403
    next(error)
  }
};
