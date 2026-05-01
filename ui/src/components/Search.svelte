<script>
  import { searchTracks, searchResults, isSearching } from '../lib/trackStore';
  import { addToQueue } from '../lib/queueStore';
  
  let query = "";

  function handleSearch() {
    if (query.trim()) {
      searchTracks(query);
    }
  }
</script>

<div class="search-container">
  <input 
    type="text" 
    bind:value={query} 
    placeholder="Search SoundCloud..." 
    on:keydown|stopPropagation={(e) => e.key === 'Enter' && handleSearch()}
  />
  <button on:click={handleSearch} disabled={$isSearching}>
    {$isSearching ? 'Searching...' : 'Search'}
  </button>

  <div class="results">
    {#each $searchResults as track}
      <div class="track-card">
        <img src={track.artwork_url} alt={track.title} />
        <div class="info">
          <p class="title">{track.title}</p>
          <p class="artist">{track.artist}</p>
        </div>
        <button on:click={() => addToQueue(track)}>
          +
        </button>
      </div>
    {/each}
  </div>
</div>

<style>
.search-container {
    position: absolute;
    bottom: 20px;
    right: 20px;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.7);
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #444;
    font-family: sans-serif;
    width: 300px;
    z-index: 999999;
}

  .track-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem;
    border-bottom: 1px solid #eee;
  }
  img { width: 50px; height: 50px; border-radius: 4px; }
  .info { flex-grow: 1; }
  .title { font-weight: bold; margin: 0; }
  .artist { font-size: 0.8rem; color: #666; margin: 0; }
</style>
