const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/storage/avatars");
  },
  resize: {
    width: 500,
    height: 500,
    interpolation: "linear",
  },
  filename: (req, file, cb) => {
    cb(null, `${req.params.id}${path.extname(file.originalname)}`);
  },
});

const uploadAvatar = multer({ storage });

module.exports = uploadAvatar;
