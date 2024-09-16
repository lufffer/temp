"use client";

import Field from "@/components/Field";
import Bold from "@/components/Bold";
import { useHash } from "@/app/home/hooks/useHash";
import { Anime } from "@/types/animes.type";

type Props = {
  animes: Anime[];
  className?: string;
  extra?: boolean;
};

const QuickInfo = ({ animes, className, extra = false }: Props) => {
  const hash = useHash();

  const anime = animes[hash];
  const rank = anime?.rank;
  const episodes = anime?.episodes;
  const status = anime?.status;
  const from = anime?.aired.from?.split("T")[0] || "--/--/--";
  const to = anime?.aired.to?.split("T")[0] || "--/--/--";
  // const type = anime?.type;
  // const source = anime?.source;
  // const duration = anime?.duration;
  // const rating = anime?.rating;
  // const season = anime?.season;
  // const year = anime?.year;
  // const studios = anime?.studios.map((studio) => studio.name).join(", ");
  // const genres = anime?.genres.map((genre) => genre.name).join(", ");
  // const demographics = anime?.demographics.map((demo) => demo.name).join(", ");

  const info = [
    ["RANK", rank],
    ["EPISODES", episodes],
    ["STATUS", status],
    ["FROM", from],
    ["TO", to],
  ];

  const extraInfo = [
    // ["TYPE", type],
    // ["SOURCE", source],
    // ["DURATION", duration],
    // ["RATING", rating],
    // ["SEASON", season],
    // ["YEAR", year],
    // ["STUDIOS", studios],
    // ["GENRES", genres],
    // ["DEMOGRAPHICS", demographics],
  ];

  return (
    <>
      <table className={`text-white my-2 ${className}`}>
        <tbody>
          {info.map((data) => (
            <tr key={data[0]}>
              <Field>
                <Bold>{data[0]}:</Bold>
              </Field>
              <Field>{data[1]}</Field>
            </tr>
          ))}
          {extra ? (
            extraInfo.map((data) => (
              <tr key={data[0]}>
                <Field>
                  <Bold>{data[0]}:</Bold>
                </Field>
                <Field>{data[1]}</Field>
              </tr>
            ))
          ) : (
            <></>
          )}
        </tbody>
      </table>
    </>
  );
};

export { QuickInfo };
