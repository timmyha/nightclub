import { Actor, CollisionType, Color, Engine, vec } from "excalibur";

export function buildWorld(game: Engine, player: Actor, map: string = "lobby"): Actor[] {
  const actors: Actor[] = [];

  if (map === "lobby") {
    // Left wall
    const leftWall = new Actor({
      pos: vec(100, 300),
      width: 20,
      height: 600,
      color: Color.fromHex("#333333"),
      collisionType: CollisionType.Fixed,
    });

    // Right wall  
    const rightWall = new Actor({
      pos: vec(700, 300),
      width: 20,
      height: 600,
      color: Color.fromHex("#333333"),
      collisionType: CollisionType.Fixed,
    });

    // Visual cue for stairs up (cyan)
    const stairsCue = new Actor({
      pos: vec(400, 30),
      width: 60,
      height: 10,
      color: Color.Cyan,
    });

    player.body.collisionType = CollisionType.Active;

    game.add(leftWall);
    game.add(rightWall);
    game.add(stairsCue);
    actors.push(leftWall, rightWall, stairsCue);
  } else {
    // Floor 1 layout

    // Left wall
    const leftWall = new Actor({
      pos: vec(100, 300),
      width: 20,
      height: 600,
      color: Color.fromHex("#444444"),
      collisionType: CollisionType.Fixed,
    });

    // Right wall
    const rightWall = new Actor({
      pos: vec(700, 300),
      width: 20,
      height: 600,
      color: Color.fromHex("#444444"),
      collisionType: CollisionType.Fixed,
    });

    // Visual cue for stairs down (orange)
    const stairsCue = new Actor({
      pos: vec(400, 570),
      width: 60,
      height: 10,
      color: Color.Orange,
    });

    player.body.collisionType = CollisionType.Active;

    game.add(leftWall);
    game.add(rightWall);
    game.add(stairsCue);
    actors.push(leftWall, rightWall, stairsCue);
  }

  // Add grid tiles for dev
  for (let i = 0; i < 800; i += 100) {
    for (let j = 0; j < 600; j += 100) {
      const tile = new Actor({
        pos: vec(i + 50, j + 50),
        width: 2,
        height: 2,
        color: Color.DarkGray,
      });
      game.add(tile);
      actors.push(tile);
    }
  }

  return actors;
}
