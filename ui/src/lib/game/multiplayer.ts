import { Actor, Color, Engine, vec } from "excalibur";
import type { Channel } from "phoenix";

export function setupMultiplayer(
  game: Engine,
  channel: Channel,
  player: Actor,
  localUserId: string
) {
  // minimal map awareness (no system yet)
  let currentMap = "lobby";
  const ghosts = new Map<string, Actor>();
  const ghostTargets = new Map<string, { x: number; y: number }>();

  function updateGhost(userId: string, x: number, y: number) {
    if (!ghosts.has(userId)) {
      const ghost = new Actor({
        pos: vec(x, y),
        width: 40,
        height: 40,
        color: Color.Gray,
      });
      game.add(ghost);
      ghosts.set(userId, ghost);
    }
    ghostTargets.set(userId, { x, y });
  }

  game.on("postupdate", () => {
    ghosts.forEach((actor, userId) => {
      const target = ghostTargets.get(userId);
      if (!target) return;

      const distance = vec(target.x, target.y).sub(actor.pos);
      if (distance.magnitude > 2) {
        actor.pos = actor.pos.add(distance.scale(0.1));
      }
    });
  });

  // Listen for movement broadcasts from server
  channel.on("player_moved", ({ id, x, y, map }) => {
    if (id === localUserId) return;
    updateGhost(id, x, y);
  });

  let lastSend = 0;

  game.on("postupdate", () => {
    const now = Date.now();
    if (player.vel.magnitude > 0 && now - lastSend > 50) {
      channel.push("move", {
        x: player.pos.x,
        y: player.pos.y,
        map: currentMap
      });
      lastSend = now;
    }
  });
}
