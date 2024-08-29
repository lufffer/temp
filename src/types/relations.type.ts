export interface Relations {
  data: Relation[];
}

export interface Relation {
  relation: string;
  entry: Entry[];
}

export interface Entry {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}
