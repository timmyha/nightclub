import { writable } from 'svelte/store';

export const djRotation = writable([]);
export const activeDJ = writable(null);

export const updateRotation = (newList) => {
  djRotation.set(newList);
};
