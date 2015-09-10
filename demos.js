var legacyHeader = 'This demo uses the web-animations-js-legacy polyfill.';
var demos = [
  {
    name: 'Parallax Starfield',
    path: 'starfield/starfield-planes.html',
    darkTheme: true,
    preview: 'resources/icons/starfield_planes.png',
    shade: '#333',
  },
  {
    name: '500 Individual Stars',
    path: 'starfield/starfield-indiv.html',
    darkTheme: true,
    preview: 'resources/icons/starfield_indiv.png',
    shade: '#333',
  },
  {
    name: 'Animate.css',
    path: 'animate_css',
    preview: 'resources/icons/animate_css.png',
    shade: '#c0dfe0',
  },
  {
    name: 'Touch',
    description: [
        "Records touch events then plays them back as a keyframe animation.",
        "Note: Requires a touch screen.",
        ],
    preview: 'resources/icons/touch.png',
    shade: '#dc0062',
    darkTheme: true,
  },
  {
    name: 'Bounce',
    path: 'bounce-timing-function',
  },
  {
    name: 'Globe',
    preview: 'resources/icons/globe.png',
    shade: '#eee',
  },
  {
    name: 'Spinning Dots',
    path: 'spin',
    darkTheme: true,
  },
  {
    name: 'Expandoboard',
    path: 'expandoboard',
    description: [
        "This animates like a zillion things and looks kinda bad in browsers without native support.",
    ],
  },
  {
    name: 'Galaxy',
    path: 'galaxy',
    darkTheme: true,
  },
  {
    name: 'Playback Control',
    path: 'playback-control',
  },
  {
    name: 'Hide/Show',
    path: 'hide-show',
  },
  {
    name: 'Ripple',
    path: 'ripple',
  },
  {
    header: legacyHeader,
    name: 'Additive Color',
    path: 'additive-color',
    darkTheme: true,
  },
  {
    header: legacyHeader,
    name: 'Rolio',
    description: [
      "Demonstrates seeking and redirecting a running animation. Press the arrow keys to direct the rolling ball.",
      "Note: This demo isn't interactive on a mobile device.",
    ],
  },
  // FIXME: Unknown. Nothing happens.
  // {
  //   header: legacyHeader,
  //   name: 'Snowfall',
  //   demos: [
  //     {path: '/snow-fall-canvas.html', name: 'Custom effects painting to a Canvas'},
  //     {path: '/snow-fall-dom.html', name: 'Animating DOM Elements'},
  //   ],
  // },
  // FIXME: Unknown. Most of the map doesn't render.
  // {
  //   name: 'Countries',
  //   path: 'countries',
  // },
  // FIXME: Not finished.
  // {
  //   name: 'Rhythm',
  //   description: "Note: This demo isn't interactive on a mobile device.",
  // },
  // },
  // FIXME: Needs polish.
  // {name: 'Walking'},
  // FIXME: Not ported to web-animations-next.
  {
    header: legacyHeader,
    name: 'Breakout',
  },
];
