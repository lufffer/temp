import { fetchJikanAnimes } from "@/actions/jikanAnimes";
import { JikanAnime } from "./providers/jikanAnime.provider";
import Background from "@/components/Background";
import Main from "@/components/Main";
import { ReactNode } from "react";
import Home from "./_pages/Home";

type Props = {
  params: {
    slug: string[];
  };
};

const Page = async ({ params }: Props) => {
  const jikanAnime = await fetchJikanAnimes(params.slug[1], 1);
  let content = <></>;

  switch (params.slug[0]) {
    case "home":
      content = <Home slug={params.slug[1]} />;
  }

  return (
    <JikanAnime value={jikanAnime.data}>
      <Background />
      <Main>{content}</Main>
    </JikanAnime>
  );
};

export default Page;
