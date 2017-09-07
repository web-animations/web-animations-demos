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
    path: 'animate_css/',
    preview: 'resources/icons/animate_css.png',
    shade: '#c0dfe0',
  },

  // Doesn't work for non-touch screens, not a good experience.
  // {
  //   name: 'Touch',
  //   description: [
  //     "Touch the screen to record events and have them played back as keyframe animations.",
  //     "Note: Requires a touch screen.",
  //   ],
  //   preview: 'resources/icons/touch.png',
  //   shade: '#dc0062',
  //   darkTheme: true,
  // },

  // Uses non-standard onsample API that we shouldn't be promoting.
  // {
  //   name: 'Bounce',
  //   path: 'bounce-timing-function/',
  //   preview: 'resources/icons/bounce.png',
  //   shade: '#303aa5',
  //   darkTheme: true,
  // },

  // This doesn't load properly in Firefox/Safari.
  // {
  //   name: 'Globe',
  //   preview: 'resources/icons/globe.png',
  //   shade: '#eee',
  // },

  {
    name: 'Spinning Dots',
    path: 'spin/',
    preview: 'resources/icons/spin.png',
    darkTheme: true,
    shade: '#0e7cf0',
  },
  {
    name: 'Expandoboard',
    path: 'expandoboard/',
    preview: 'resources/icons/expandoboard.png',
    description: [
      "This animates like a zillion things and looks kinda bad in browsers without native support.",
    ],
    darkTheme: 'true',
    shade: '#6a6a6a',
  },
  {
    name: 'Galaxy',
    path: 'galaxy/',
    preview: 'resources/icons/galaxy.png',
    shade: '#b7c7d8',
  },
  {
    name: 'Playback Control',
    path: 'playback-control/',
    preview: 'resources/icons/playback.png',
    shade: '#4e6cef',
    darkTheme: true,
  },

  // Doesn't work on all browsers, movement is not smooth on Chrome.
  // {
  //   name: 'Hide/Show',
  //   path: 'hide-show/',
  //   shade: '#f0f0f0',
  //   preview: 'resources/icons/hide-show.png',
  // },

  {
    name: 'Ripple',
    path: 'ripple/',
    shade: '#2ebcfc',
    preview: 'resources/icons/ripple.png',
    description: [
      "Touch or click the screen!"
    ],
  },
  {
    name: 'Waves',
    path: 'waves/',
    shade: 'blue',
    preview: 'resources/icons/waves.png',
    darkTheme: true,
  },
  {
    name: 'Clouds',
    path: 'clouds/',
    shade: '#D73786',
    preview: 'resources/icons/clouds.png',
    darkTheme: true,
    description: [
      "Touch the page or scroll to change the speed"
    ],
  },

  // TODO: Port legacy demos to use current Web Animations API.
  // See https://github.com/web-animations/web-animations-demos/pull/74
];
