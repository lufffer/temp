import mongoose from "mongoose";

const favoriteImagesSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
});

const FavoriteImages =
  mongoose.models.FavoriteImages ||
  mongoose.model("FavoriteImages", favoriteImagesSchema);

export { FavoriteImages };
