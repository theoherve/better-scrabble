export type LobbyState = "waiting" | "playing" | "finished";

export type Player = {
  id: string;
  name: string;
  isHost: boolean;
  isReady: boolean;
};

export type Lobby = {
  code: string;
  state: LobbyState;
  players: Player[];
  createdAt: number;
  startedAt?: number;
  gameData?: any; // Pour la grille, scores, etc.
};
