export interface Videos {
  data: Data;
}

export interface Data {
  promo: Promo[];
  episodes: Episode[];
  music_videos: MusicVideo[];
}

export interface Promo {
  title: string;
  trailer: Trailer;
}

export interface Trailer {
  youtube_id: string;
  url: string;
  embed_url: string;
  images: Images;
}

export interface Images {
  image_url: string;
  small_image_url: string;
  medium_image_url: string;
  large_image_url: string;
  maximum_image_url: string;
}

export interface Episode {
  mal_id: number;
  url: string;
  title: string;
  episode: string;
  images: Images2;
}

export interface Images2 {
  jpg: Jpg;
}

export interface Jpg {
  image_url: string;
}

export interface MusicVideo {
  title: string;
  video: Video;
  meta: Meta;
}

export interface Video {
  youtube_id: string;
  url: string;
  embed_url: string;
  images: Images3;
}

export interface Images3 {
  image_url: string;
  small_image_url: string;
  medium_image_url: string;
  large_image_url: string;
  maximum_image_url: string;
}

export interface Meta {
  title: string;
  author: string;
}
