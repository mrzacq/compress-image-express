const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use("/uploads", express.static("uploads"));

app.post("/", upload.single("picture"), async (req, res) => {
  try {
    fs.access("./uploads", (error) => {
      if (error) {
        fs.mkdirSync("./uploads");
      }
    });

    const url = `${new Date().getTime()}-${req.file.originalname
      .split(" ")
      .join("-")}`;

    await sharp(req.file.buffer)
      .resize({ width: 300, height: 300 })
      .toFile(`./uploads/${url}`);

    res.json({
      message: "Sukses",
      url: `http://localhost:3000/uploads/${url}`,
    });
  } catch (error) {
    res.json(error);
  }
});

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
