let DEBUG;
if (process.env.NODE_ENV === "development") {
  DEBUG = true;
} else {
  DEBUG = false;
}
const mongoose = require("mongoose");
const Recipe = require("../models/recipe.model");

exports.createRecipe = async (req, res) => {
  if (req.file === undefined) {
    return res.status(400).json({
      error:
        "Error uploading category Image. Please send the correct image format and make sure the size is below 4mb.",
      success: false,
    });
  }
  const { name, ingredients, steps } = req.body;
  const urlScheme = DEBUG ? req.protocol + "://" : "";
  const filePath = req.file.path.replace(/\\/g, "/");
  const recipeImageLink = urlScheme + req.headers.host + "/" + filePath;

  const recipe = new Recipe({
    _id: new mongoose.Types.ObjectId(),
    name,
    ingredients: JSON.parse(ingredients),
    steps,
    imageUrl: recipeImageLink,
  });

  try {
    const result = await recipe.save();
    DEBUG && console.log(result);
    return res.status(201).json({
      message: "Successfully added Category.",
      data: result,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
      success: false,
    });
  }
};

exports.getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.find().select("-__V").exec();
    res.status(200).json({
      data: recipe,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err,
    });
  }
};
