import { writable } from 'svelte/store';

// This is the public list of users in the DJ booth
export const djRotation = writable([]);
// The user currently "on air"
export const activeDJ = writable(null);

export const updateRotation = (newList) => {
  djRotation.set(newList);
};
