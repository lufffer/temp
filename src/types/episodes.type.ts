export interface Episodes {
  headers: Headers;
  sources: Source[];
}

export interface Headers {
  Referer: string;
  watchsb: string | null;
  "User-Agent": string | null;
}

export interface Source {
  url: string;
  quality: string;
  isM3U8: boolean;
}
