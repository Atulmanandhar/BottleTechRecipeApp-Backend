const mongoose = require("mongoose");

const ingredientSchema = mongoose.Schema({
  name: { type: String, required: true },
  quantity: {
    type: Number,
    required: true,
  },
  unit: { type: String, required: true },
});

const recipeSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    ingredients: {
      type: [ingredientSchema],
    },
    steps: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Recipe", recipeSchema);
