"use server";

export const getFetch = async (title: string | null, pageParam: number) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_GELBOORU_POSTS! + pageParam + "&tags=" + title,
  );

  return res.json();
};

export const get = async (title: string) => {
  console.log(process.env.NEXT_PUBLIC_GELBOORU_TAGS + `${title}%`);
  const res = await fetch(process.env.NEXT_PUBLIC_GELBOORU_TAGS + `${title}%`);

  return res.json();
};
