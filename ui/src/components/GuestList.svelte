<script lang="ts">
  import { guestList } from '../lib/presenceStore';
  import { fade } from 'svelte/transition';
</script>

<div class="guest-container">
  <h3>Live Guestlist</h3>
  <ul>
    {#each $guestList as guest (guest.id)}
      <li transition:fade>
        <span class="status-dot" style:background={guest.color}></span>
        {guest.name}
      </li>
    {/each}
  </ul>
</div>

<style>
  .guest-container {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #444;
    font-family: sans-serif;
    min-width: 150px;
    pointer-events: none;
    z-index: 999999;
  }

  h3 { margin: 0 0 10px 0; font-size: 0.9rem; color: #aaa; text-transform: uppercase; }
  ul { list-style: none; padding: 0; margin: 0; }
  li { display: flex; align-items: center; margin-bottom: 5px; font-weight: bold; }
  .status-dot { width: 8px; height: 8px; border-radius: 50%; margin-right: 8px; }
</style>
