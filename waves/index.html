<!DOCTYPE html>
<script src="../components/web-animations-js/web-animations.min.js"></script>

<style>
body {
  margin: 0;
  background: blue;
  overflow: hidden;
}

#perspective {
  margin-left: calc((100vw - 50vmin) / 2);
  margin-top: calc((100vh - 50vmin) / 4);
  width: 50vmin;
  height: 50vmin;
  perspective: 60vmin;
}

#container {
  width: 50vmin;
  height: 50vmin;
  line-height: 0;
  transform-style: preserve-3d;
}

.box {
  display: inline-block;
  background: black;
}
</style>

<div id="perspective">
  <div id="container"></div>
</div>

<script>
container.animate({
  transform: [
    'rotateX(70deg) rotateZ(0deg)',
    'rotateX(70deg) rotateZ(360deg)',
  ],
}, {
  duration: 20000,
  iterations: Infinity,
});

var sideCount = 20;
var adjustment = (sideCount % 2) * 0.5;
var min = -sideCount / 2 + adjustment;
var max = sideCount / 2 + adjustment;

for (var y = min; y < max; y++) {
  for (var x = min; x < max; x++) {
    var box = createBox();
    box.animate({
      transform: [
        'translateZ(0px)',
        'translateZ(40px)',
      ],
      opacity: [1, 0],
    }, {
      delay: (x*x + y*y) * 20,
      duration: 2000,
      iterations: Infinity,
      direction: 'alternate',
      easing: 'ease-in',
    });
  }
}

function createBox() {
  var box = document.createElement('div');
  box.className = 'box';
  box.style.width = (100 / sideCount) + '%';
  box.style.height = (100 / sideCount) + '%';
  container.appendChild(box);
  return box;
}
</script>
