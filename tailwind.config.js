export const content = [
  './pages/**/*.{html,js}',
  './components/**/*.{html,js}',
  "./src/**/*.{js,jsx,ts,tsx}",
];
export const theme = {
  colors: {
    'blue': '#141625',
    'blue2': '#1f2138',
    'purple': '#7c5df9',
    'card': '#1f213a',
    'invoice':'#10101c',
    'input': '#1f213a',
    'totals': '#252945',
    'orange': '#ee5756',
    'white': '#fff',
    'greenbg': '#1f2c3f',
    'greentext': '#3bb196',
    'paidtext': '#3bb196',
    'orangetext': '#ff8a00',
    'orangebg': '#2e2430',
    'yellow': '#ffc82c',
    'black' : '#000000',
    'gray-dark': '#273444',
    'gray': '#141416',
    'gray-light': '#d3dce6',
    'custom-blue': '#273A5C',
  },
  fontFamily: {
    sans: ['Graphik', 'sans-serif'],
    serif: ['Merriweather', 'serif'],
  },
  extend: {
    spacing: {
      '40': '36rem',
      'small': '10px',
      'medium': '30px',
      'icon': '1000px',
      'iconwidth': '70px'
    },
    // borderRadius: {
    //   '4xl': '2rem',
    // }
  }
};