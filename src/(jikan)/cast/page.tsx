"use client";

import { createPortal } from "react-dom";
import { useAnimeStore } from "@/providers/store.provider";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { animesQuery } from "@/services/jikan.service";
import { favoritesQuery } from "@/services/favorites.service";
import { charactersQuery } from "./services/characters.service";
import { useSetPages } from "@/hooks/useSetPages";
import { useSetAnime } from "@/hooks/useSetAnime";
import { useSetCast } from "./hooks/useSetCast";
import Glass from "@/components/Glass";

function Page() {
  const { queryKey } = useAnimeStore((state) => state);
  const animesRes = useInfiniteQuery(animesQuery(queryKey));
  const favoritesRes = useInfiniteQuery(favoritesQuery());

  const ptr = useSetPages(animesRes, favoritesRes);
  const anime = useSetAnime(ptr);

  const mal_id = anime?.mal_id || null;
  const characters = useQuery(charactersQuery(mal_id));
  const cast = useSetCast(characters);

  return (
    <div className="overflow-scroll h-[75svh] my-4">
      <table className="text-white text-center w-full my-glass rounded-2xl">
        <thead>
          <th>Characters</th>
          <th>Voice Actors</th>
        </thead>
        <tbody>
          {cast.map((data) => {
            const img = data.character.images.webp.image_url;
            const name = data.character.name;
            const role = data.role;

            return (
              <>
                <tr className="border-b-2 border-solid border-white">
                  <td className="py-4 w-1/2">
                    <img width={64} src={img} alt={name} className="mx-auto" />
                    <span className="mx-auto">
                      {name} ({role})
                    </span>
                  </td>
                  <td className="py-4 w-1/2">
                    {data.voice_actors.map((va) => {
                      const language = va.language;
                      const img = va.person.images.jpg.image_url;
                      const name = va.person.name;

                      return (
                        <div className="py-2">
                          <img
                            width={64}
                            src={img}
                            alt={name}
                            className="mx-auto"
                          />
                          <span>
                            {name} ({language})
                          </span>
                        </div>
                      );
                    })}
                  </td>
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
      {createPortal(<Glass />, document.body)}
    </div>
  );
}

export default Page;
