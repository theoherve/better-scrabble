import { create } from "zustand";
import { Lobby, Player } from "./lobbyTypes";

interface LobbyStore {
  lobby: Lobby | null;
  player: Player | null;
  createLobby: (playerName: string) => void;
  joinLobby: (code: string, playerName: string) => void;
  setReady: (ready: boolean) => void;
  startGame: () => void;
  leaveLobby: () => void;
}

export const useLobbyStore = create<LobbyStore>((set, get) => ({
  lobby: null,
  player: null,

  createLobby: (playerName) => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const player: Player = {
      id: Math.random().toString(36).substring(2, 10),
      name: playerName,
      isHost: true,
      isReady: false,
    };
    set({
      lobby: {
        code,
        state: "waiting",
        players: [player],
        createdAt: Date.now(),
      },
      player,
    });
  },

  joinLobby: (code, playerName) => {
    // Pour le MVP, on simule un lobby unique en local
    const lobby = get().lobby;
    if (!lobby || lobby.code !== code) return;
    const player: Player = {
      id: Math.random().toString(36).substring(2, 10),
      name: playerName,
      isHost: false,
      isReady: false,
    };
    set({
      lobby: {
        ...lobby,
        players: [...lobby.players, player],
      },
      player,
    });
  },

  setReady: (ready) => {
    const lobby = get().lobby;
    const player = get().player;
    if (!lobby || !player) return;
    set({
      lobby: {
        ...lobby,
        players: lobby.players.map((p) =>
          p.id === player.id ? { ...p, isReady: ready } : p
        ),
      },
      player: { ...player, isReady: ready },
    });
  },

  startGame: () => {
    const lobby = get().lobby;
    if (!lobby) return;
    set({
      lobby: {
        ...lobby,
        state: "playing",
        startedAt: Date.now(),
      },
    });
  },

  leaveLobby: () => {
    set({ lobby: null, player: null });
  },
}));
