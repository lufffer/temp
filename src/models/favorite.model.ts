import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
  mal_id: { type: Number, required: true, unique: true },
  title: { type: String, required: true, unique: true },
  rank: { type: Number, unique: true },
  episodes_number: { type: Number },
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
  episodes: [{ id: { type: Number, unique: true } }],
  gallery: { type: mongoose.Schema.Types.ObjectId, ref: "Gallery" },
});

const Favorite =
  mongoose.models.Favorite || mongoose.model("Favorite", favoriteSchema);

export { Favorite };
