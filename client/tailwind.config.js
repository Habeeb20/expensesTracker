/** @type {import('tailwindcss').Config} */
export const content = [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
  extend: {
    colors: {
      'e-ride-purple': "rgb(78, 78, 74)",

   
      green: "#32E00FFF",
     black: '#090909FF',
     dark: {
          bg: '#090909FF',      // your custom black
          card: '#111111',
          text: '#e5e5e5',
          muted: '#888888',
        },
 
    },
  },
};
export const plugins = [];
