"use server";

import { currentUser } from "@clerk/nextjs/server";
import { connectToDB } from "@/app/db";
import { User } from "@/models/user.model";
import { FavoriteImages } from "@/app/gallery/models/favoriteImages.model";

export const get = async (): Promise<any> => {
  connectToDB();

  try {
    const user = await currentUser();
    const res = await User.findOne({ clerkId: user?.id }).populate({
      path: "favoriteImages",
      model: FavoriteImages,
    });

    return res ? JSON.parse(JSON.stringify({ data: res?.favoriteImages })) : [];
  } catch (err: any) {
    throw new Error(`Failed to get favorite images: ${err.message}`);
  }
};

export const add = async (id: { id: number }): Promise<any> => {
  connectToDB();

  try {
    const user = await currentUser();

    const userDoc = await User.findOne({ clerkId: user?.id });
    let favoriteImagesDoc = await FavoriteImages.findOne(id);
    if (!favoriteImagesDoc) {
      favoriteImagesDoc = await FavoriteImages.create(id);
      await favoriteImagesDoc.save();
    }

    const favorite = userDoc.favoriteImages.some((fav: any) =>
      fav.equals(favoriteImagesDoc._id),
    );
    if (!favorite) {
      userDoc.favoriteImages.push(favoriteImagesDoc._id);
      await userDoc.save();
    }

    return JSON.parse(JSON.stringify(favoriteImagesDoc));
  } catch (err: any) {
    throw new Error(`Failed to add image to favorites: ${err.message}`);
  }
};

export const remove = async (id: { id: number }): Promise<any> => {
  connectToDB();

  try {
    const user = await currentUser();

    const userDoc = await User.findOne({ clerkId: user?.id });
    const favoriteImagesDoc = await FavoriteImages.findOne(id);
    if (!favoriteImagesDoc) {
      throw new Error("Image not found");
    }

    const favoriteIndex = userDoc.favoriteImages.indexOf(favoriteImagesDoc._id);
    if (favoriteIndex === -1) {
      throw new Error("Image not found in favorites");
    }

    userDoc.favoriteImages.splice(favoriteIndex, 1);
    await userDoc.save();

    return JSON.parse(JSON.stringify(favoriteImagesDoc));
  } catch (err: any) {
    throw new Error(`Failed to delete image: ${err.message}`);
  }
};
