import { fetchJikanAnimes } from "@/actions/jikanAnimes";
import { JikanAnime } from "./providers/jikanAnime.provider";
import Background from "@/components/Background";
import Main from "@/components/Main";
import Home from "./_pages/Home";
import { Suspense } from "react";

type Props = {
  params: {
    slug: string[];
  };
};

const Page = async ({ params }: Props) => {
  const jikanAnime = await fetchJikanAnimes(params.slug[1], 1, params.slug[2]);
  let content = <></>;

  switch (params.slug[0]) {
    case "home":
      content = <Home slug={params.slug.slice(1)} />;
      break;
  }

  return (
    <JikanAnime value={jikanAnime.data}>
      <Background />
      <Main>
        <Suspense
          fallback={
            <div className="w-full flex flex-col items-center justify-center">
              <img src="/loader.gif" alt="Loading..." />
              <p className="text-pink-300 text-2xl">Loading...</p>
            </div>
          }
        >
          {content}
        </Suspense>
      </Main>
    </JikanAnime>
  );
};

export default Page;
