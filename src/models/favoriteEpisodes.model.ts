import mongoose from "mongoose";

const favoriteEpisodesSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
});

const FavoriteEpisodes =
  mongoose.models.FavoriteEpisodes ||
  mongoose.model("FavoriteEpisodes", favoriteEpisodesSchema);

export { FavoriteEpisodes };
