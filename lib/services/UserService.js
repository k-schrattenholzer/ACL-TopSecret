//will add a userservice class here that will have a create/sign in methods
//the create method will take in firstName, lastName, email, and password
//and will use bcrypt to pass the input password to the hashing algorithm
//then we'll call our user model, with the insert method, and create (then return) our user with the hashed password (NEVER store plain text passwords. EVER.)
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = class UserService {
  static async create({ firstName, lastName, email, password }) {
    const passwordHash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    const user = await User.insert({
      firstName,
      lastName,
      email,
      passwordHash,
    });

    return user;
  }
};