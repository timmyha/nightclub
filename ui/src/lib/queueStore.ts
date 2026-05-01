import { writable } from 'svelte/store';

// This is the user's private "Crate"
export const userQueue = writable([]);

export const addToQueue = (track) => {
  userQueue.update(items => {
    // Prevent duplicates if you want
    if (items.find(t => t.id === track.id)) return items;
    return [...items, track];
  });
};

export const removeFromQueue = (trackId) => {
  userQueue.update(items => items.filter(t => t.id !== trackId));
};
