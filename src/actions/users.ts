"use server";

import { connectToDB } from "@/app/db";
import { User } from "@/models/user.model";

type User = {
  clerkId: string;
  username: string;
};

export const create = async (user: User) => {
  connectToDB();

  try {
    const newUser = await User.create(user);
    await newUser.save();

    return JSON.parse(JSON.stringify(newUser));
  } catch (err: any) {
    throw new Error(`Failed to create user: ${err.message}`);
  }
};
