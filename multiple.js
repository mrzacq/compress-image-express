const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const app = express();

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Hanya menerima file gambar", false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

app.use("/uploads", express.static("uploads"));

app.post(
  "/multiple",
  upload.fields([{ name: "images", maxCount: 3 }]),
  async (req, res) => {
    try {
      if (req.files.images.length !== 3) {
        throw new Error("Masukkan 3 foto");
      } else {
        const images = [];
        req.files.images.forEach(async (file) => {
          const newFilename = `/uploads/${file.fieldname
            .split(" ")
            .join("-")}-${Date.now()}.png`;

          await sharp(file.buffer)
            .resize({ width: 640, height: 320 })
            .toFormat("png")
            .png({ quality: 90 })
            .toFile(`./${newFilename}`)
            .then(() => {
              images.push(`http://localhost:3000${newFilename}`);
            });
        });
        res.status(200).json({
          message: "Sukses",
          images,
        });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
