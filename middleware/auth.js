// middleware/auth.js
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

module.exports = function (req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Incoming token:', token); // Add this
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded user:', decoded); // Add this
    req.user = decoded.id;
    next();
  } catch (err) {
    console.error('Invalid token:', err); // Add this
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
