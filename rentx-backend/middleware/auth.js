const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1]; // expecting "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // 🔥 Make sure this sets req.userId
    next();
  } catch (err) {
    console.error('Invalid token', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
