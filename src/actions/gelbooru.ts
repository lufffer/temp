"use server";

export const getFetch = async (title: string | null, pageParam: number) => {
  const res = await fetch(process.env.NEXT_PUBLIC_GELBOORU_POSTS! + title);

  return res.json();
};

export const get = async (title: string) => {
  console.log(title);
  const res = await fetch(process.env.NEXT_PUBLIC_GELBOORU_TAGS + `%${title}%`);

  return res.json();
};
