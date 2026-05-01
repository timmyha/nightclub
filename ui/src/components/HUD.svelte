<script lang="ts">
  export let status: string;
  export let zone: string;
</script>

<div class="hud">
  <p>Status: {status}</p>
  <p>Zone: {zone}</p>
</div>

<style>
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
</style>
