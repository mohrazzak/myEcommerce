const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const userDAL = require('./userDAL');
const {
  constants: {
    EM_HOST,
    EM_USER,
    EM_PASSWORD,
    NODE_ENV,
    EMAIL_TOKEN,
    LOCAL_URL,
    NODE_PORT,
    AUTH_TOKEN,
  },
} = require('../../config');
// USER SERVICES
function create(user) {
  return userDAL.create(user);
}

function genToken({ id, isAdmin, email }, tokenType, minutes) {
  return jwt.sign(
    {
      id,
      isAdmin,
      email,
    },
    tokenType === 'reset' ? EMAIL_TOKEN : AUTH_TOKEN,
    { expiresIn: `${minutes}m` }
  );
}

function generalize(user) {
  return {
    id: user.id,
    name: user.name,
    isAdmin: user.isAdmin,
    email: user.email,
  };
}

async function comparePasswords({ password, hashedPassword }) {
  if (!(await bcrypt.compare(password, hashedPassword))) return false;
  return true;
}

function getAllUsers() {
  return userDAL.getAllUsers();
}

function getUserByEmail(email) {
  return userDAL.getUserByEmail(email);
}

function getUserById(id) {
  return userDAL.getUserById(id);
}

function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function sendMail(email, token, subject, path) {
  const mailURL = `${LOCAL_URL}:${NODE_PORT}/${path}/${token}`;
  if (NODE_ENV === 'development') console.log(mailURL);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: EM_HOST,
    auth: {
      user: EM_USER,
      pass: EM_PASSWORD,
    },
  });
  await transporter.sendMail({
    from: `"e-commerce" <${process.env.EM_USER}>`,
    to: email,
    subject,
    html: `
    <h1>E-COMMERCE EMAIL [${subject}]</h1>
    <p>Click
    // TODO use Frontend url instead
    <a href="" target="_blank">this link</a>
    to proceed your request for ${subject}</p>
    <p>Greetings.</p>
    `,
  });
}

function verifyToken(token, tokenType) {
  const SECRET = tokenType === 'reset' ? EMAIL_TOKEN : AUTH_TOKEN;
  return jwt.verify(token, SECRET);
}

async function changePassword({ id, password }) {
  const hashedPassword = await hashPassword(password);
  return userDAL.changePassword({ id, password: hashedPassword });
}

function activate(id) {
  return userDAL.activate(id);
}

function deleteUser(id) {
  return userDAL.delete(id);
}

module.exports = {
  create,
  genToken,
  generalize,
  comparePasswords,
  getAllUsers,
  changePassword,
  getUserByEmail,
  getUserById,
  hashPassword,
  sendMail,
  verifyToken,
  activate,
  deleteUser,
};
