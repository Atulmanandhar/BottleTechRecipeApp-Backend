const router = require("express").Router();

const mongoose = require("mongoose");

const multer = require("multer");
const path = require("path");
const { createRecipe, getRecipe } = require("../controllers/recipe.controller");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "-" +
        (Date.now() * (100 - 1) + 1) +
        path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false); //reject file
    cb(
      new Error(
        "You can only upload a maximum of 1 file. File can be of jpeg,png or pdf files only"
      )
    );
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 6, //6mb
  },
  fileFilter: fileFilter,
});
const uploadMiddleWare = upload.single("imageUrl");

router.post(
  "/recipe",
  function (req, res, next) {
    uploadMiddleWare(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return res.status(500).json({
          error:
            "You can only upload a maximum of 1 files. File can be of jpeg and pngs only",
          err,
        });
      } else if (err) {
        return res.status(500).json({
          error: "Error uploading files. Please try again",
          err,
        });
      }
      next();
    });
  },
  createRecipe
);
router.get("/recipe", getRecipe);

module.exports = router;
