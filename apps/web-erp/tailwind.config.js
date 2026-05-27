const sharedConfig = require('@ronda/config/tailwind');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...sharedConfig,
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
};
