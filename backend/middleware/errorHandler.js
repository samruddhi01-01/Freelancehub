// Centralized error handler — keep as the last middleware in server.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(', ') });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Duplicate entry', keyValue: err.keyValue });
  }

  res.status(err.statusCode || 500).json({
    message: err.message || 'Server error',
  });
};

module.exports = errorHandler;
