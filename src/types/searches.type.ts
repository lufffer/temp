export interface Search {
  currentPage: number;
  hasNextPage: boolean;
  results: Result[];
}

export interface Result {
  id: string;
  title: string;
  image: string;
  releaseDate: string | null;
  subOrDub: "sub" | "dub";
}
