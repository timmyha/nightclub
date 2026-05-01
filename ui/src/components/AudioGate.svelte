<script lang="ts">
  export let onEnter: () => void;
</script>

<div class="audio-gate">
  <div class="modal">
    <h2>Welcome to the Club</h2>
    <p>We need to unlock audio to start the music.</p>
    <button on:click={onEnter}>Enter Club</button>
  </div>
</div>

<style>
  .audio-gate {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    pointer-events: none;
  }

  .modal {
    background: #222;
    padding: 2rem;
    border-radius: 8px;
    text-align: center;
    color: white;
    border: 1px solid #444;
  }

  button {
    background: #0088ff;
    color: white;
    border: none;
    padding: 1rem 2rem;
    font-size: 1.2rem;
    cursor: pointer;
    border-radius: 4px;
    pointer-events: auto;
  }

  button:hover {
    background: #0077ee;
  }
</style>
