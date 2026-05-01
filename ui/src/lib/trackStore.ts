import { writable } from 'svelte/store';

export const searchResults = writable([]);
export const isSearching = writable(false);

export const searchTracks = async (query) => {
  if (!query) return;
  
  isSearching.set(true);
  
  const response = await fetch(`/api/search?q=${query}`);
  const data = await response.json();
  
  searchResults.set(data);
  isSearching.set(false);
};
