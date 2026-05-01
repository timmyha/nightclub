import { Engine, DisplayMode, Color, Actor, Keys } from "excalibur";
import type { Channel } from "phoenix";
import { createPlayer, updatePlayer } from "./game/player";
import { setupMultiplayer } from "./game/multiplayer";
import { setupZones } from "./game/zones";
import { buildWorld } from "./game/world";

let localUserId: string = "";
let currentMap = "lobby";
let getAudioNodesFn: (() => { audioCtx: AudioContext; biquadFilter: BiquadFilterNode }) | null = null;
let worldActors: Actor[] = [];

function triggerMapTransition(to: string) {
  const nodes = getAudioNodesFn?.();
  if (!nodes) return;

  const { audioCtx, biquadFilter } = nodes;
  const now = audioCtx.currentTime;

  // Muffle then open up (stairs transition)
  biquadFilter.frequency.setValueAtTime(400, now);
  biquadFilter.frequency.linearRampToValueAtTime(20000, now + 1);
}

function rebuildWorld(game: Engine, player: Actor) {
  // Build new map - actors are added to scene by buildWorld
  worldActors = buildWorld(game, player, currentMap);
}

export function initGame(
  gameCanvas: HTMLCanvasElement,
  channel: Channel,
  userId: string,
  onZoneChange: (zone: string) => void,
  getAudioNodes: () => { audioCtx: AudioContext; biquadFilter: BiquadFilterNode }
) {
  localUserId = userId;
  getAudioNodesFn = getAudioNodes;
  currentMap = "lobby";
  worldActors = [];

  const game = new Engine({
    canvasElement: gameCanvas,
    width: 800,
    height: 600,
    displayMode: DisplayMode.FillScreen,
    backgroundColor: Color.fromHex("#1a1a1a"),
    antialiasing: false,
  });

  const player = createPlayer(game);

  // POINTER LOGIC

  let isPointerDown = false;

  game.input.pointers.primary.on('down', (_evt) => {
    isPointerDown = true;
    // We clear actions just once on click to make sure
    // no old "moveTo" commands are fighting our new velocity.
    player.actions.clearActions();
  });

  game.input.pointers.primary.on('up', () => {
    isPointerDown = false;
  });
  // OTHER USERS

  setupMultiplayer(game, channel, player, localUserId);

  setupZones(game, player, onZoneChange, getAudioNodes);

  // STAIRS / MAP TRANSITION - Press Space when at stairs
  game.input.keyboard.on("press", (evt) => {
    console.log("Key pressed:", evt.key, "pos:", player.pos.y, "map:", currentMap);
    if (evt.key === Keys.Space) {
      if (player.pos.y < 50 && currentMap === "lobby") {
        console.log("Going up to floor_1");
        currentMap = "floor_1";
        player.pos = vec(400, 520);
        triggerMapTransition("floor_1");
        rebuildWorld(game, player);
      } else if (player.pos.y > 550 && currentMap === "floor_1") {
        console.log("Going down to lobby");
        currentMap = "lobby";
        player.pos = vec(400, 80);
        triggerMapTransition("lobby");
        rebuildWorld(game, player);
      }
    }
  });

  game.on("postupdate", () => {
    updatePlayer(player, game, isPointerDown);
  });

  // Background color based on map
  game.on("preupdate", () => {
    game.backgroundColor = currentMap === "lobby"
      ? Color.fromHex("#1a1a1a")
      : Color.fromHex("#0a0a2a");
  });

  // Build initial world
  worldActors = buildWorld(game, player, currentMap);

  game.start();
}
