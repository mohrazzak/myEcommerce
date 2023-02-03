const User = require('./User');

// TODO Change function way to function(){}

// Find by email
exports.findByEmail = async (email) => {
  const user = await User.findOne({ where: { email } });

  return user;
};

// Get all users
exports.getAllUsers = () =>
  User.findAll({ attributes: { exclude: ['password'] } });

// Register
exports.create = async ({ name, email, password }) =>
  User.create({
    name,
    email,
    password,
  });

exports.getUserById = (userId) =>
  User.findByPk(userId, { attributes: { exclude: ['password'] } });

exports.getUserByEmail = async (email) => User.findOne({ where: { email } });

exports.changePassword = async ({ id, password }) =>
  User.update({ password }, { where: { id } });

exports.activate = async (id) =>
  User.update({ isActive: true }, { where: { id } });

exports.delete = async (id) => User.destroy({ where: { id } });
