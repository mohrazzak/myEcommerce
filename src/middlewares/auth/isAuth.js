const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { ApiError } = require('../../utils/errors');
const { userServices } = require('../../modules/users');
// const { verifyToken } = require('../../modules/users/userServices'); this works but i want to use the benefits of index.js

console.log(userServices); // undefined
module.exports = (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');
    if (!authHeader)
      throw new ApiError('Not authorized.', StatusCodes.UNAUTHORIZED);
    const token = authHeader.split(' ')[1];
    const decodedToken = verifyToken(token, 'confirm');
    if (!decodedToken)
      throw new ApiError('Unexpected token.', StatusCodes.UNAUTHORIZED);
    req.user = { id: decodedToken.id, isAdmin: decodedToken.isAdmin };
    next();
  } catch (err) {
    next(err);
  }
};
