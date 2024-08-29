import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Anime" }],
  favoriteEpisodes: [
    { type: mongoose.Schema.Types.ObjectId, ref: "FavoriteEpisodes" },
  ],
  favoriteImages: [
    { type: mongoose.Schema.Types.ObjectId, ref: "FavoriteImages" },
  ]
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export { User };
