import { writable } from 'svelte/store';

export interface Guest {
  id: string;
  name: string;
  color: string;
}

export const guestList = writable<Guest[]>([]);
