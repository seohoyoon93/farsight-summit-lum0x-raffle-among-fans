export interface Fan {
  fid: number;
  score: number;
  reactions: number;
  recasts: number;
  ranks: number;
  display_name: string;
}

export interface Cast {
  reactions: { fids: number[] };
  recasts: { fids: number[] };
}

export interface Participant {
  fid: number;
  display_name: string;
}
