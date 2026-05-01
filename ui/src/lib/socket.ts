import { writable } from "svelte/store";
import { Socket, Presence, type Channel } from "phoenix";

type State = {
  status: string;
  channel: Channel | null;
  userId: string | null;
};

function createSocketStore() {
  const { subscribe, update } = writable<State>({
    status: "Connecting...",
    channel: null,
    userId: null,
  });

  let socket: Socket | null = null;
  let presence: Presence | null = null;
  let presenceCallback: ((list: any[]) => void) | null = null;

  function connect(onPresenceSync: (list: any[]) => void) {
    // prevent multiple sockets from being created
    if (socket) return;

    presenceCallback = onPresenceSync;
    socket = new Socket("ws://localhost:4000/socket", {
      heartbeatIntervalMs: 3000,
    });

    socket.connect();

    // do not create/join channel here; handled in joinLobby
    update((s) => ({
      ...s,
    }));
  }

  function joinLobby(): Promise<{ channel: Channel; userId: string }> {
    return new Promise((resolve, reject) => {
      if (!socket) return reject(new Error("Socket not connected"));

      // ensure we don't join multiple times
      let existingChannel: Channel | null = null;
      update((s) => {
        existingChannel = s.channel;
        return s;
      });

      if (existingChannel) {
        return resolve({ channel: existingChannel, userId: "" as any });
      }

      const channel = socket.channel("room:lobby", {});
      presence = new Presence(channel);

      presence.onSync(() => {
        const list: any[] = [];
        presence!.list((id, { metas }) => {
          list.push({
            id,
            name: metas[0].name,
            color: metas[0].color,
          });
        });
        presenceCallback?.(list);
      });

      channel
        .join()
        .receive("ok", (res) => {
          update((s) => ({
            ...s,
            status: "Connected to Lobby",
            channel,
            userId: res.user_id,
          }));

          resolve({ channel, userId: res.user_id });
        })
        .receive("error", reject);
    });
  }

  return {
    subscribe,
    connect,
    joinLobby,
  };
}

export const socketStore = createSocketStore();
