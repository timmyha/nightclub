import { Actor, Engine } from "excalibur";

export function setupZones(
  game: Engine,
  player: Actor,
  onZoneChange: (zone: string) => void,
  getAudioNodes: () => { audioCtx: AudioContext; biquadFilter: BiquadFilterNode }
) {
  let currentZone = "dancefloor";

  game.on("postupdate", () => {
    const { audioCtx, biquadFilter } = getAudioNodes();
    const newZone = player.pos.y < 300 ? "lobby" : "dancefloor";

    if (newZone !== currentZone) {
      currentZone = newZone;
      onZoneChange(currentZone);
    }

    if (!audioCtx || !biquadFilter) return;

    if (currentZone === "lobby") {
      biquadFilter.frequency.setTargetAtTime(400, audioCtx.currentTime, 0.1);
    } else {
      biquadFilter.frequency.setTargetAtTime(20000, audioCtx.currentTime, 0.1);
    }
  });
}
