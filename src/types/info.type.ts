export interface Info {
  id: string;
  title: string;
  url: string;
  image: string;
  releaseDate: string | null;
  description: null;
  genres: string[];
  subOrDub: "sub" | "dub";
  type: string | null; // or null
  status: string;
  otherName: string; // or null
  totalEpisodes: number;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  number: number;
  url: string;
}
