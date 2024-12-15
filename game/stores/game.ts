import { atom } from 'nanostores';
import { Page } from '../shared.ts';

export const $score = atom(0);
export const $page = atom<Page>('results');
export const $sound = atom<boolean>(true);
export const $results = atom<any>(null);
