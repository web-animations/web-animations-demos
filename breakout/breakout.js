'use strict';

(function() {

/**
  * Create the field, blocks, ball and animation before the game starts.
  */
function setUp() {
  var field = document.getElementById('field');

  var grid = createGrid(10, 15);
  field.appendChild(grid);

  var ball = document.getElementById('ball');
  ball['x'] = field.clientWidth / 2 - ball.clientWidth / 2;
  ball['y'] = field.clientHeight / 2 - ball.clientHeight / 2;
  ball.style.webkitTransform = 'translate(' + ball['x'] + 'px, ' +
      ball['y'] + 'px)';

  var paddle = document.getElementById('paddle');
  paddle['x'] = field.clientWidth / 2 - paddle.clientWidth / 2;
  paddle['y'] = paddle.offsetTop;
  paddle.style.webkitTransform = 'translateX(' + paddle['x'] + 'px)';

  return gridAnimation();
}

/**
  * Create grid storing the blocks.
  */
function createGrid(height, width) {
  var grid = document.createElement('table');

  for (var i = 0; i < height; i++) {
    var row = document.createElement('tr');

    for (var j = 0; j < width; j++) {
      var cell = document.createElement('td');
      var block = document.createElement('div');

      block.classList.add('block');
      block.style.visible = 'hidden';
      cell.appendChild(block);
      row.appendChild(cell);
    }

    grid.appendChild(row);
  }
  return grid;
}

/**
  * Animate the blocks fading in.
  */
function gridAnimation() {
  var colors = [
    'rgb(51, 105, 232)',
    'rgb(213, 15, 37)',
    'rgb(238, 178, 17)',
    'rgb(0, 153, 57)'
  ];

  // Convert nodelist to array in order to use splice.
  var blocks = Array.prototype.slice.call(
      document.querySelectorAll('.block'));

  var fadeIn = new SeqGroup([]);

  while (blocks.length) {
    var randBlock = Math.floor(Math.random() * blocks.length);
    var randColor = Math.floor(Math.random() * colors.length);

    var animation = new Animation(blocks[randBlock], {visibility: 'visible',
      backgroundColor: colors[randColor]}, {duration: 0.02});
    fadeIn.append(animation);

    blocks.splice(randBlock, 1);
  }

  return fadeIn;
}

/**
  * Helper function to create new animations for CSS transforms.
  */
function transformAnimation(target, keyframes, timing) {
  return new Animation(target, keyframes.map(
        function(t) { return {transform: t}; }), timing);
}

/**
  * Returns the entire animation of the breakout ball.
  */
function playAnimation(ball, paddle) {
  var ballAnim, paddleAnim;
  var anim = new SeqGroup([]);
  // Start the ball off by dropping it straight down onto the paddle.
  var velocity = {'dx': 50, 'dy': 200};

  // Get a new velocity and continue bouncing the ball around.
  var i = 0;
  while (i < 50) {
    var nextPos = getNextPosition(ball, paddle, velocity);

    // Follow the ball with the paddle.
    var dx = ball['x'] - nextPos['x'];
    if (dx) {
      paddleAnim = transformAnimation(paddle, ['translateX(' +
            (nextPos['x'] - paddle.clientWidth / 2) + 'px)'],
          {duration: nextPos['dt'] * 0.5, delay: nextPos['dt'] * 0.5});
    }

    ball['x'] = nextPos['x'];
    ball['y'] = nextPos['y'];

    ballAnim = transformAnimation(ball, ['translate(' + ball['x'] + 'px, ' +
            (ball['y'] - ball.clientHeight) + 'px)'], nextPos['dt']);
    anim.append(new ParGroup([ballAnim, paddleAnim]));

    velocity = getVelocity(velocity);
    i++;
  }
  return anim;
}

/**
  * Gets a new velocity based off the old one.
  */
function getVelocity(velocity) {
  // FIXME: Invert velocity depending on what direction the ball collides from.
  velocity['dx'] = velocity['dx'] == 0 ? 0 : -velocity['dx'];
  velocity['dy'] = velocity['dy'] == 0 ? 0 : -velocity['dy'];
  return velocity;
}

/**
  * Calculates the next position of the ball when it collides with something.
  */
function getNextPosition(ball, paddle, velocity) {
  // FIXME: Implement block collision detection.
  var vertDist;
  var horzDist;

  // Get the horizontal and vertical distance the ball is away from
  // the direction it is travelling.
  if (velocity['dx'] < 0) {
    horzDist = ball['x'] - field.offsetLeft +
      0.5 * ball.clientWidth;
  } else {
    horzDist = field.clientLeft + field.clientWidth - ball['x'] -
      0.5 * ball.clientWidth;
  }
  if (velocity['dy'] < 0) {
    vertDist = ball['y'] - field.offsetTop;
  } else {
    // If travelling downwards to the bottom wall, the paddle comes into play.
    vertDist = field.offsetTop + paddle.offsetTop - ball['y'] -
      0.5 * ball.clientHeight;
  }

  // Calculate the least amount of time required to hit at least one wall.
  var horzCollideTime = horzDist / Math.abs(velocity['dx']);
  var vertCollideTime = vertDist / Math.abs(velocity['dy']);
  var dt = horzCollideTime < vertCollideTime ?
      horzCollideTime : vertCollideTime;

  return {
    'x': ball['x'] + dt * velocity['dx'],
    'y': ball['y'] + dt * velocity['dy'],
    'dt': dt
  };
}

/**
  * Sets up and returns the entire animation of the breakout game.
  */
function playGame() {
  var gameAnimation = new SeqGroup([]);
  gameAnimation.append(setUp());
  gameAnimation.append(playAnimation(document.getElementById('ball'),
                                      document.getElementById('paddle')));
  return gameAnimation;
}

document.timeline.play(playGame());

})();
