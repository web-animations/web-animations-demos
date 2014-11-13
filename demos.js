var demos = [
  {
    name: 'Additive Color',
    path: 'additive-color',
    polyfill: ['/?polyfill'],
  },
  {
    name: 'Starfield',
    polyfill: [
      {path: '/starfield-planes.html?polyfill', name: 'Parallax Starfield'},
      {path: '/starfield-indiv.html?polyfill', name: '500 Individual Stars'},
    ],
  },
  // FIXME: Not ported to web-animations-next.
  // {
  //   name: 'Rolio',
  //   description: [
  //     "Demonstrates seeking and redirecting a running animation. Press the arrow keys to direct the rolling ball.",
  //     "Note: This demo isn't interactive on a mobile device.",
  //   ],
  // },
  // FIXME: Unknown. Some of the map doesn't render.
  // countries: 'Countries',
  {
    name: 'Animate.css',
    path: 'animate_css',
  },
  {
    name: 'Touch',
    description: [
        "Records touch events then plays them back as a keyframe animation.",
        "Note: Requires a touch screen.",
        ],
  },
  // FIXME: Not ported to web-animations-next.
  // {name: 'Walking'},
  {
    name: 'Bounce',
    path: 'bounce-timing-function',
  },
  // FIXME: Not ported to web-animations-next.
  // {name: 'Breakout'},
  // FIXME: Not ported to web-animations-next.
  // {
  //   name: 'Rhythm',
  //   description: "Note: This demo isn't interactive on a mobile device.",
  // },
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
];
