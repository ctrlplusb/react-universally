/**
 * This file contains polyfills that should be shared for all the environments,
 * where our app runs
 */
import { polyfill as rafPolyfill } from 'raf';

// We need the requestAnimationFrame polyfill to support features of React >=16
rafPolyfill();
