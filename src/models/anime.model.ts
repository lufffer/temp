import mongoose from "mongoose";

const animeSchema = new mongoose.Schema({
  mal_id: { type: Number, required: true, unique: true },
  title: { type: String, required: true, unique: true },
  rank: { type: Number, required: true, unique: true },
  episodes: { type: Number },
  status: { type: String, required: true },
  aired: {
    from: { type: String },
    to: { type: String },
  },
  images: {
    webp: {
      image_url: { type: String },
    },
  },
});

const Anime = mongoose.models.Anime || mongoose.model("Anime", animeSchema);

export { Anime };
