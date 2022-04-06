export const SIGNATURE_COLOR = [
  '#ffd300', // Yellow
  '#0d8b22', // Green
  '#0e47c8', // Dark blue
  '#0095ff', // Light blue
  '#9d00d1', // Purple
  '#ff5bdb', // Pink
  '#ff2e38', // Red
  '#ff8000'  // Orange
];

// https://gist.github.com/renancouto/4675192
export const lighten = (color, percent) => {
  const num = parseInt(color.replace('#',''), 16);
  const amt = Math.round(255 * percent);

  const r = (num >> 16) + amt;
  const b = (num >> 8 & 0x00ff) + amt;
  const g = (num & 0x0000ff) + amt;

  return '#' + 
    (0x1000000 + 
      (r<255?r<1?0:r:255)*0x10000 + 
      (b<255?b<1?0:b:255)*0x100 + 
      (g<255?g<1?0:g:255)
    ).toString(16).slice(1);
}