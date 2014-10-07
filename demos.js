var demos = [
  {
    name: 'Starfield',
    polyfill: [
      {path: '/starfield-planes-polyfill.html', name: 'Parallax Starfield'},
      {path: '/starfield-indiv-polyfill.html', name: '500 Individual Stars'},
    ],
    native: [
      {path: '/starfield-planes.html', name: 'Parallax Starfield'},
      {path: '/starfield-indiv.html', name: '500 Individual Stars'},
    ],
  },
  {
    name: 'Rolio',
    description: [
      "Demonstrates seeking and redirecting a running animation. Press the arrow keys to direct the rolling ball.",
      "Note: This demo isn't interactive on a mobile device.",
    ],
  },
  // FIXME: Doesn't animate.
  // {name: 'Globe'},
  // FIXME: Unknown. Some of the map doesn't render.
  // countries: 'Countries',
  {
    name: 'Animate.css',
    path: 'animate_css',
    polyfill: ['/?polyfill'],
    native: ['/'],
  },
  {
    name: 'Touch',
    description: [
        "Records touch events then plays them back as a keyframe animation.",
        "Note: Requires a touch screen.",
        ],
  },
  {name: 'Walking'},
  {
    name: 'Bounce',
    path: 'bounce-timing-function',
  },
  {name: 'Breakout'},
  {
    name: 'Rhythm',
    description: "Note: This demo isn't interactive on a mobile device.",
  },
  {name: 'Globe'},
  {
    name: 'Snowfall',
    polyfill: [
      {path: '/snow-fall-canvas.html', name: 'Custom effects painting to a Canvas'},
      {path: '/snow-fall-dom.html', name: 'Animating DOM Elements'},
    ],
  },
  {
    name: 'Spinning Dots',
    path: 'spin',
    polyfill: ['/?polyfill'],
    native: ['/'],
  },
  {
    name: 'Expandoboard',
    path: 'expandoboard',
    polyfill: ['/?polyfill'],
    native: ['/'],
    description: [
        "This animates like a zillion things and looks kinda bad in the polyfill as a result.",
    ],
  },
  {
    name: 'Galaxy',
    path: 'galaxy',
    polyfill: ['/?polyfill'],
    native: ['/'],
  },
  {
    name: 'Playback Control',
    path: 'playback-control',
    polyfill: ['/?polyfill'],
    native: ['/'],
    nativeNote: [
        "This demo requires Chrome 39.",
    ],
  },
  {
    name: 'Hide/Show',
    path: 'hide-show',
    polyfill: ['/?polyfill'],
    polyfillNote: [
        "Note: This demo isn't currently functioning correctly under the Polyfill.",
    ],
    native: ['/'],
  },

  //'components/web-animations-tools/wat-wat': 'wat',
  //'components/web-animations-tools/wat-bezier': 'Bezier',
  //'components/web-animations-tools/wat-step': 'Step',
  //'components/web-animations-tools/wat-keyframe-inspector': 'Keyframes',
  //'components/web-animations-tools/wat-tree': 'TreeView',
  //'components/web-animations-tools/wat-timeline': 'Timeline',
  //'components/web-animations-tools/wat-player-controls': 'Controls',
];
