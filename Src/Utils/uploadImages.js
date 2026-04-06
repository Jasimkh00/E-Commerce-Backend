const multer = require("multer");
const fs = require("fs");

// ensure folder exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname.replace(/\s/g, "");
    cb(null, name);
  }
});

// ❗ NO LIMITS HERE
const upload = multer({
  storage
});

module.exports = upload;