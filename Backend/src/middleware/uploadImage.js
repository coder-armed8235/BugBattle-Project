const multer = require('multer');
const cloudinary = require('../config/cloudinary')
const fs = require('fs');

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage }).single('avatar');

// Combined middleware
const uploadImage = (req, res, next) => {

  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      if (req.file) {

        const result = await cloudinary.uploader.upload(req.file.path);

        // Cloudinary URL body me daal diya
        req.body.avatarUrl = result.secure_url;
        // Local file delete (important 🔥)
          fs.unlinkSync(req.file.path);
      }
       
      next();

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

};

module.exports = uploadImage;
