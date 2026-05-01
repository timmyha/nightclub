import { Actor, Color, Engine, Keys, vec } from "excalibur";

export function createPlayer(game: Engine) {
  const player = new Actor({
    pos: vec(400, 300),
    width: 32,
    height: 32,
    color: Color.Cyan,
    z: 1,
  });

  player.pointer.useGraphicsBounds = false;
  game.currentScene.camera.strategy.elasticToActor(player, 0.1, 0.1);

  game.add(player);
  return player;
}

export function updatePlayer(player: Actor, game: Engine, isPointerDown: boolean) {
  const speed = 200;
  let moveVec = vec(0, 0);

  const kb = game.input.keyboard;
  if (kb.isHeld(Keys.W)) moveVec.y = -1;
  if (kb.isHeld(Keys.S)) moveVec.y = 1;
  if (kb.isHeld(Keys.A)) moveVec.x = -1;
  if (kb.isHeld(Keys.D)) moveVec.x = 1;

  if (isPointerDown && moveVec.magnitude === 0) {
    const screenPos = game.input.pointers.primary.lastScreenPos;
    const currentTarget = game.screen.screenToWorldCoordinates(screenPos);
    const direction = currentTarget.sub(player.pos);

    if (direction.magnitude > 10) {
      moveVec = direction.normalize();
    } else {
      moveVec = vec(0, 0);
    }
  }

  player.vel = moveVec.scale(speed);

  // simple head bob
  if (player.vel.magnitude > 0) {
    player.graphics.opacity = 0.8;
    player.rotation = Math.sin(Date.now() * 0.01) * 0.1;
  } else {
    player.graphics.opacity = 1.0;
    player.rotation = 0;
  }
}
