<script lang="ts">
  import { onMount } from "svelte";
  import { socketStore } from "./lib/socket";
  import { initGame } from "./lib/game";
  import AudioGate from "./components/AudioGate.svelte";
  import HUD from "./components/HUD.svelte";
  import GuestList from "./components/GuestList.svelte";
  import Search from "./components/Search.svelte";
  import { guestList, type Guest } from "./lib/presenceStore";

  let gameCanvas: HTMLCanvasElement;
  let status = $state("Connecting...");
  let currentZone = $state("dancefloor");
  let audioStarted = $state(false);

  let audioCtx: AudioContext;
  let biquadFilter: BiquadFilterNode;
  let oscillator: OscillatorNode;
  let audioSource: MediaElementAudioSourceNode;
  let audioTag: HTMLAudioElement;

  function setupAudio() {
    audioCtx = new (window.AudioContext || window.AudioContext)();

    audioTag = new Audio();

    audioTag.crossOrigin = "anonymous";

    audioTag.src = "/song.mp3";
    audioTag.loop = true;

    const source = audioCtx.createMediaElementSource(audioTag);

    biquadFilter = audioCtx.createBiquadFilter();
    biquadFilter.type = "lowpass";
    biquadFilter.frequency.setValueAtTime(20000, audioCtx.currentTime);

    source.connect(biquadFilter);
    biquadFilter.connect(audioCtx.destination);

    audioTag.play();
    audioStarted = true;
  }

  onMount(() => {
    let unsubscribe: () => void = () => {};

    async function init() {
      try {
        socketStore.connect((list) => {
          guestList.set(list);
        });

        unsubscribe = socketStore.subscribe(($s) => {
          status = $s.status;
        });

        // Deterministic join moment
        const { channel, userId } = await socketStore.joinLobby();

        console.log("JOIN OK", channel, userId);

        initGame(
          gameCanvas,
          channel,
          userId,
          (zone) => (currentZone = zone),
          () => ({ audioCtx, biquadFilter }),
        );
      } catch (e) {
        console.error("INIT FAILED", e);
      }
    }

    init();

    return () => unsubscribe();
  });
</script>

<main>
  <HUD {status} zone={currentZone} />
  <GuestList />
  <Search />

  <canvas bind:this={gameCanvas}></canvas>
  {#if !audioStarted}
    <AudioGate onEnter={setupAudio} />
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
    overflow: hidden;
    background: #000;
  }

  :global(#app) {
    width: 100vw;
    height: 100vh;
  }

  main {
    width: 100vw;
    height: 100vh;
    position: relative;
  }

  .hud {
    position: absolute;
    top: 10px;
    left: 10px;
    color: white;
    z-index: 10;
    background: rgba(0, 0, 0, 0.5);
    padding: 10px;
    pointer-events: none;
  }

  canvas {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
