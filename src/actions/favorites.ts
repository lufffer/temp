"use server";

import { currentUser } from "@clerk/nextjs/server";
import { connectToDB } from "@/app/db";
import { User } from "@/models/user.model";
import { Anime } from "@/models/anime.model";
import { type Anime as AnimeT } from "@/types/anime.type";

export const get = async () => {
  connectToDB();

  try {
    const user = await currentUser();
    const res = await User.findOne({ clerkId: user?.id }).populate({
      path: "favorites",
      model: Anime,
    });

    return res ? JSON.parse(JSON.stringify({ data: res?.favorites })) : [];
  } catch (err: any) {
    throw new Error(`Failed to get favorites: ${err.message}`);
  }
};

export const add = async (anime: AnimeT) => {
  connectToDB();

  try {
    const user = await currentUser();

    const userDoc = await User.findOne({ clerkId: user?.id });
    let animeDoc = await Anime.findOne({ mal_id: anime.mal_id });
    if (!animeDoc) {
      animeDoc = await Anime.create(anime);
      await animeDoc.save();
    }

    const favorite = userDoc.favorites.some((fav) => fav.equals(animeDoc._id));
    if (!favorite) {
      userDoc.favorites.push(animeDoc._id);
      await userDoc.save();
    }

    return JSON.parse(JSON.stringify(userDoc.favorites));
  } catch (err: any) {
    throw new Error(`Failed to create anime: ${err.message}`);
  }
};

export const remove = async (anime: AnimeT) => {
  connectToDB();

  try {
    const user = await currentUser();

    const userDoc = await User.findOne({ clerkId: user?.id });
    const animeDoc = await Anime.findOne({ mal_id: anime.mal_id });
    if (!animeDoc) {
      throw new Error("Anime not found");
    }

    const favoriteIndex = userDoc.favorites.indexOf(animeDoc._id);
    if (favoriteIndex === -1) {
      throw new Error("Anime not found in favorites");
    }

    userDoc.favorites.splice(favoriteIndex, 1);
    await userDoc.save();

    return JSON.parse(JSON.stringify(userDoc.favorites));
  } catch (err: any) {
    throw new Error(`Failed to delete anime: ${err.message}`);
  }
};
