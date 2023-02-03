const express = require('express');
const {
  getAllUsers,
  getUserById,
  register,
  login,
  resetPasswordReq,
  resetPasswordRes,
  confirm,
  deleteUser,
} = require('./userController');
const { isAdmin, isAuth } = require('../../middlewares/auth');

const router = express.Router();

router.get('/', isAuth, isAdmin, getAllUsers);

router.get('/:userId', getUserById);

router.post('/login', login);

router.post('/register', register);

router.post('/confirm/:token', confirm);

router.post('/reset-password', resetPasswordReq);

router.put('/reset-password/:token', resetPasswordRes);

router.delete('/:userId', isAuth, isAdmin, deleteUser);

module.exports = router;
