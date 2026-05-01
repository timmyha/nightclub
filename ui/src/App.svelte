<script lang="ts">
  import { onMount } from "svelte";
  import { socketStore } from "./lib/socket";
  import { initGame } from "./lib/game";
  import AudioGate from "./components/AudioGate.svelte";
  import HUD from "./components/HUD.svelte";
  import GuestList from "./components/GuestList.svelte";
  import Search from "./components/Search.svelte";
  import { guestList, type Guest } from "./lib/presenceStore";

  // State Variables (Svelte 5 uses $state for reactivity)
  let gameCanvas: HTMLCanvasElement;
  let status = $state("Connecting...");
  let currentZone = $state("dancefloor");
  let audioStarted = $state(false);

  // Audio Globals
  let audioCtx: AudioContext;
  let biquadFilter: BiquadFilterNode;
  let oscillator: OscillatorNode;
  let audioSource: MediaElementAudioSourceNode;
  let audioTag: HTMLAudioElement;

  function setupAudio() {
    audioCtx = new (window.AudioContext || window.AudioContext)();

    // 1. Create the HTML5 Audio element
    audioTag = new Audio();

    // 2. CRITICAL: This allows the Web Audio API to "touch" the data
    audioTag.crossOrigin = "anonymous";

    // 3. Use a direct MP3 link (Replace this with any live .mp3 URL)
    audioTag.src = "/song.mp3";
    audioTag.loop = true;

    // 4. Connect the Tag to the Web Audio Pipeline
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
    overflow: hidden; /* Prevent scrollbars for the game */
    background: #000;
  }

  /* Ensure the root and main fill the viewport */
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
    pointer-events: none; /* Let clicks pass through to the game */
  }

  canvas {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
