// @route POST /api/uploads  (multipart/form-data, field name "file")
const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(201).json({ fileUrl });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadFile };
