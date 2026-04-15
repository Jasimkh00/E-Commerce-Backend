// Require Multer And Fs :
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

    // ONLY CHANGE HERE (FIX OVERWRITE BUG)
    const name =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      "-" +
      file.originalname.replace(/\s/g, "");

    cb(null, name);
  }
});

// NO OTHER CHANGE
const upload = multer({
  storage
});

// Export Module:
module.exports = upload;
