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
    preview: 'resources/icons/bounce.png',
    shade: '#303aa5',
    darkTheme: true,
  },
  {
    name: 'Globe',
    preview: 'resources/icons/globe.png',
    shade: '#eee',
  },
  {
    name: 'Spinning Dots',
    path: 'spin',
    preview: 'resources/icons/spin.png',
    darkTheme: true,
    shade: '#0e7cf0',
  },
  {
    name: 'Expandoboard',
    path: 'expandoboard',
    preview: 'resources/icons/expandoboard.png',
    description: [
        "This animates like a zillion things and looks kinda bad in browsers without native support.",
    ],
    darkTheme: 'true',
    shade: '#6a6a6a',
  },
  {
    name: 'Galaxy',
    path: 'galaxy',
    preview: 'resources/icons/galaxy.png',
    shade: '#b7c7d8',
  },
  {
    name: 'Playback Control',
    path: 'playback-control',
    preview: 'resources/icons/playback.png',
    shade: '#4e6cef',
    darkTheme: true,
  },
  {
    name: 'Hide/Show',
    path: 'hide-show',
    shade: '#eef',
    preview: 'resources/icons/hide-show.png',
  },
  {
    name: 'Ripple',
    path: 'ripple',
    shade: '#2ebcfc',
    preview: 'resources/icons/ripple.png',
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
    preview: 'resources/icons/rolio.png',
    shade: '#178f46',
    darkTheme: true,
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
    preview: 'resources/icons/breakout.png',
    shade: '#eee',
  },
];
