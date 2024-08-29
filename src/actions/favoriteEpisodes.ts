"use server";

import { currentUser } from "@clerk/nextjs/server";
import { connectToDB } from "@/app/db";
import { User } from "@/models/user.model";
import { FavoriteEpisodes } from "@/models/favoriteEpisodes.model";

export const get = async (): Promise<any> => {
  connectToDB();

  try {
    const user = await currentUser();
    const res = await User.findOne({ clerkId: user?.id }).populate({
      path: "favoriteEpisodes",
      model: FavoriteEpisodes,
    });

    return res
      ? JSON.parse(JSON.stringify({ data: res?.favoriteEpisodes }))
      : [];
  } catch (err: any) {
    throw new Error(`Failed to get favorite episodes: ${err.message}`);
  }
};

export const add = async (id: { id: string }): Promise<any> => {
  connectToDB();

  try {
    const user = await currentUser();

    const userDoc = await User.findOne({ clerkId: user?.id });
    let favoriteEpisodesDoc = await FavoriteEpisodes.findOne(id);
    if (!favoriteEpisodesDoc) {
      favoriteEpisodesDoc = await FavoriteEpisodes.create(id);
      await favoriteEpisodesDoc.save();
    }

    const favorite = userDoc.favoriteEpisodes.some((fav: any) =>
      fav.equals(favoriteEpisodesDoc._id),
    );
    if (!favorite) {
      userDoc.favoriteEpisodes.push(favoriteEpisodesDoc._id);
      await userDoc.save();
    }

    return JSON.parse(JSON.stringify(favoriteEpisodesDoc));
  } catch (err: any) {
    throw new Error(`Failed to add episode to favorites: ${err.message}`);
  }
};

export const remove = async (id: { id: string }): Promise<any> => {
  connectToDB();

  try {
    const user = await currentUser();

    const userDoc = await User.findOne({ clerkId: user?.id });
    const favoriteEpisodesDoc = await FavoriteEpisodes.findOne(id);
    if (!favoriteEpisodesDoc) {
      throw new Error("Episode not found");
    }

    const favoriteIndex = userDoc.favoriteEpisodes.indexOf(
      favoriteEpisodesDoc._id,
    );
    if (favoriteIndex === -1) {
      throw new Error("Episode not found in favorites");
    }

    userDoc.favoriteEpisodes.splice(favoriteIndex, 1);
    await userDoc.save();

    return JSON.parse(JSON.stringify(favoriteEpisodesDoc));
  } catch (err: any) {
    throw new Error(`Failed to delete episode: ${err.message}`);
  }
};
