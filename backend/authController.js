const db = require('./userModel');
const bcrypt = require('bcrypt');

// Registrar usuario
function registerUser({ email, password, name }, callback) {
  const hashedPassword = bcrypt.hashSync(password, 10);
  db.run(
    'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
    [email, hashedPassword, name],
    function (err) {
      callback(err, this ? this.lastID : null);
    }
  );
}

// Iniciar sesión
function loginUser({ email, password }, callback) {
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return callback(err);
    if (!user) return callback(null, false);
    const valid = bcrypt.compareSync(password, user.password);
    callback(null, valid ? user : false);
  });
}

module.exports = { registerUser, loginUser };