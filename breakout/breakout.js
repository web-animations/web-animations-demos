'use strict';

(function() {

var COLORS = [
  'rgb(51, 105, 232)',
  'rgb(213, 15, 37)',
  'rgb(238, 178, 17)',
  'rgb(0, 153, 57)'
];
var BASE_SPEED = 500;
var BLOCK_FADE_SPEED = 0.02;
var BLOCK_HEIGHT = 15;
var BLOCK_WIDTH = 45;
var GRID_HEIGHT = 10;
var GRID_WIDTH = 15;
var MAX_BOUNCES = 5000;
var PADDING = 20;

/**
 * Helper function updating all coordinates for an element.
 */
function updatePosition(target, leftCoord, topCoord) {
  target['left'] = leftCoord;
  target['top'] = topCoord;
  target['right'] = leftCoord + target.clientWidth;
  target['bottom'] = topCoord + target.clientHeight;
}

/**
 * Create the field, blocks, ball and animation before the game starts.
 */
function setUp() {
  var grid = createGrid(GRID_HEIGHT, GRID_WIDTH);
  updatePosition(field, 0, 0);

  var ball = document.getElementById('ball');
  updatePosition(ball, field.clientWidth / 2 - ball.clientWidth / 2,
      field.clientHeight / 2 - ball.clientHeight / 2);

  var paddle = document.getElementById('paddle');
  updatePosition(paddle, field.clientWidth / 2 - paddle.clientWidth / 2,
                 paddle.offsetTop);
  paddle.style.webkitTransform = 'translateX(' + paddle['left'] + 'px)';

  return new ParGroup([
      transformAnimation(ball, ['translate(' + ball['left'] + 'px, ' +
                         ball['top'] + 'px)'], 0),
      gridAnimation()
  ]);
}

/**
 * Create grid storing the blocks.
 */
function createGrid(height, width) {
  var grid = document.getElementById('grid');

  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      var block = document.createElement('div');
      block['left'] = x * BLOCK_WIDTH;
      block['top'] = y * BLOCK_HEIGHT;
      block['right'] = (x + 1) * BLOCK_WIDTH;
      block['bottom'] = (y + 1) * BLOCK_HEIGHT;

      block.classList.add('block');
      block.classList.add('active');
      block.setAttribute('id', y * width + x);
      block.style.visible = 'hidden';
      block.style.height = BLOCK_HEIGHT;
      block.style.width = BLOCK_WIDTH;
      block.style.webkitTransform = 'translate(' + block['left'] + 'px, ' +
         block['top'] + 'px)';

      grid.appendChild(block);
    }
  }
  return grid;
}

/**
 * Animate the blocks fading in.
 */
function gridAnimation() {
  // Convert nodelist to array in order to use splice.
  var blocks = Array.prototype.slice.call(
      document.querySelectorAll('.block.active'));

  var fadeIn = new SeqGroup([]);

  while (blocks.length) {
    var randBlock = Math.floor(Math.random() * blocks.length);
    var randColor = Math.floor(Math.random() * COLORS.length);

    var animation = new Animation(blocks[randBlock], {visibility: 'visible',
      backgroundColor: COLORS[randColor]}, {duration: BLOCK_FADE_SPEED});
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
 * Precalculates path of the ball and generates the appropriate animations.
 */
function playAnimation(ball, paddle) {
  var anim = new SeqGroup([]);
  // Generate a random direction for the ball to travel.
  var vertDir = Math.random() < 0.5 ? 1 : -1;
  var horzDir = Math.random() < 0.5 ? 1 : -1;
  var velocity = {'dx': horzDir * (Math.random() + 0.5) * BASE_SPEED,
    'dy': vertDir * (Math.random() + 0.5) * BASE_SPEED};

  var i = 0;
  while (document.querySelectorAll('.block.active').length &&
      i++ < MAX_BOUNCES) {
    var parAnim = new ParGroup([]);
    var nextPos = getNextBallMovement(ball, paddle, velocity);

    updatePosition(ball, nextPos['x'], nextPos['y']);

    var ballAnim = transformAnimation(ball, ['translate(' + ball['left'] +
          'px, ' + ball['top'] + 'px)'], nextPos['dt']);
    parAnim.append(ballAnim);

    // Animate block destruction.
    if (nextPos['destroyed']) {
      parAnim.append(new Animation(nextPos['destroyed'],
          [{backgroundColor: 'transparent'}],
          {duration: 0, delay: nextPos['dt']}));
    }

    anim.append(parAnim);

    velocity = getVelocity(velocity, nextPos['invert']);
  }
  return anim;
}

/*
 * Look for blocks in the path of the ball.
 */
function getObstacleBlocks(ball, velocity) {
  // Convert to array in order to use for each.
  var blocks = Array.prototype.slice.call(
      document.querySelectorAll('.block.active'));

  var collidingBlocks = {};
  // FIXME: Refactor to allow an x-velocity of 0.
  var m = velocity['dy'] / velocity['dx'];

  // Nested functions to calculate x, y coordinates using y - y1 = m(x - x1).
  function getX(y, horzEdge) {
    // Ball collides on its left/right edge depending on velocity.
    var vertEdge = velocity['dx'] < 0 ? 'left' : 'right';
    return (y - ball[horzEdge]) / m + ball[vertEdge];
  }

  function getY(x, vertEdge) {
    // Ball collides on its top/bottom edge depending on velocity.
    var horzEdge = velocity['dy'] < 0 ? 'top' : 'bottom';
    return m * (x - ball[vertEdge]) + ball[horzEdge];
  }

  // Check all the blocks' edges to see if the ball passes through them.
  blocks.forEach(function(block) {
    // Get intersecting coordinates for the ball path and the block edge.
    ['left', 'top', 'right', 'bottom'].forEach(function(edge) {
      var edgeIntersect = {};
      if (edge == 'left' || edge == 'right') {
        edgeIntersect['x'] = block[edge];
        if (edge == 'left') {
          edgeIntersect['y'] = getY(block[edge], 'right');
        } else {
          edgeIntersect['y'] = getY(block[edge], 'left');
        }
      } else {
        edgeIntersect['y'] = block[edge];
        if (edge == 'top') {
          edgeIntersect['x'] = getX(block[edge], 'bottom');
        } else {
          edgeIntersect['x'] = getX(block[edge], 'top');
        }
      }

      // If the intersection lies within the block, the block lies on the path.
      if (!(block['left'] <= edgeIntersect['x'] &&
          edgeIntersect['x'] <= block['right'] &&
          block['top'] <= edgeIntersect['y'] &&
          edgeIntersect['y'] <= block['bottom'])) {
        return;
      }
      // The ball must be travelling towards the block for it to collide.
      if ((velocity['dx'] < 0 && block['right'] > ball['right']) ||
          (velocity['dx'] > 0 && block['left'] < ball['left']) ||
          (velocity['dy'] < 0 && block['bottom'] > ball['bottom']) ||
          (velocity['dy'] > 0 && block['top'] < ball['top'])) {
        return;
      }
      if (collidingBlocks[block.getAttribute('id')]) {
        collidingBlocks[block.getAttribute('id')][edge] = edgeIntersect;
      } else {
        collidingBlocks[block.getAttribute('id')] = {'block': block};
        collidingBlocks[block.getAttribute('id')][edge] = edgeIntersect;
      }
    });
  });

  return collidingBlocks;
}

/**
 * Checks all the block on the path of the ball and returns the one the ball
 * will collide with first and what position it will collide at.
 */
// FIXME: Block collision not 100% accurate, write tests to fix this.
function getBlockCollision(ball, velocity) {
  var collidingBlocks = getObstacleBlocks(ball, velocity);
  // If there are any blocks in the path of the ball, check which block it
  // collides with and get the coordinates at which the collision occurs.
  if (!Object.keys(collidingBlocks).length) {
    return undefined;
  }
  var horzDist = Infinity;
  var vertDist = Infinity;
  var horzBlock, vertBlock;

  for (var blockId in collidingBlocks) {
    var collision = collidingBlocks[blockId];
    var block = collision['block'];
    if (velocity['dx'] < 0) {
      // Get the rightmost collision.
      if (collision['right']) {
        var d = ball['left'] - collision['right']['x'];
        if (d <= horzDist) {
          horzDist = d;
          horzBlock = block;
        }
      }
    } else {
      // Get the leftmost collision.
      if (collision['left']) {
        var d = collision['left']['x'] - ball['right'];
        if (d <= horzDist) {
          horzDist = d;
          horzBlock = block;
        }
      }
    }
    if (velocity['dy'] < 0) {
      // Get the bottommost collision.
      if (collision['bottom']) {
        var d = ball['top'] - collision['bottom']['y'];
        if (d <= vertDist) {
          vertDist = d;
          vertBlock = block;
        }
      }
    } else {
      // Get the topmost collision.
      if (collision['top']) {
        var d = collision['top']['y'] - ball['bottom'];
        if (d <= vertDist) {
          vertDist = d;
          vertBlock = block;
        }
      }
    }
  }

  // If still no collision detected, return undefined.
  if ((!horzBlock) && !(vertBlock)) {
    return undefined;
  }
  return {
    'horzDist': horzDist,
    'horzBlock': horzBlock,
    'vertDist': vertDist,
    'vertBlock': vertBlock
  };
}

function getWallCollision(ball, velocity, paddle) {
  var horzDist, vertDist;
  if (velocity['dx'] < 0) {
    horzDist = ball['left'];
  } else {
    horzDist = field['right'] - ball['right'];
  }
  if (velocity['dy'] < 0) {
    vertDist = ball['top'];
  } else {
    vertDist = paddle.offsetTop - ball['bottom'];
  }
  return {
    'horzDist': horzDist,
    'vertDist': vertDist
  };
}

/**
 * Gets a new velocity depending on where the ball hit the paddle.
 */
function getVelocity(velocity, invert) {
  if (invert == 'x') {
    velocity['dx'] = velocity['dx'] == 0 ? 0 : -velocity['dx'];
  } else {
    velocity['dy'] = velocity['dy'] == 0 ? 0 : -velocity['dy'];
  }
  return velocity;
}

/**
 * Calculates the next position of the ball when it collides with something,
 * the time it takes to do so, and the blocks it destroys.
 */
function getNextBallMovement(ball, paddle, velocity) {
  var destroyed;
  var collision = getBlockCollision(ball, velocity);
  // If no collision detected with blocks, get the distance away from the wall.
  if (!collision) {
    collision = getWallCollision(ball, velocity, paddle);
  }

  // Check the time required for the ball to travel that horizontal/vertical
  // distance.
  // FIXME: Refactor to allow a x/y velocity of 0.
  var horzDt = collision['horzDist'] / Math.abs(velocity['dx']);
  var vertDt = collision['vertDist'] / Math.abs(velocity['dy']);
  var dt = Math.min(horzDt, vertDt);
  var invert = dt == horzDt ? 'x' : 'y';

  if (collision['horzBlock'] || collision['vertBlock']) {
    if (dt == horzDt) {
      collision['horzBlock'].classList.remove('active');
      destroyed = collision['horzBlock'];
    } else {
      collision['vertBlock'].classList.remove('active');
      destroyed = collision['vertBlock'];
    }
  }

  return {
    'x': Math.round(ball['left'] + dt * velocity['dx']),
    'y': Math.round(ball['top'] + dt * velocity['dy']),
    'dt': dt,
    'invert': invert,
    'destroyed': destroyed
  };
}

/**
 * Add a game over screen with an option to replay the animation.
 */
function gameOver() {
  var ball = document.getElementById('ball');
  var paddle = document.getElementById('paddle');
  var field = document.getElementById('field');

  // Add game over screen.
  var screen = document.createElement('div');
  screen.classList.add('screen');
  screen.style.height = field.clientHeight / 2;
  screen.style.width = field.clientWidth;

  var text = document.createElement('h2');
  text.appendChild(document.createTextNode('Game over!'));

  // Button to replay the animation.
  var replay = document.createElement('button');
  replay.appendChild(document.createTextNode('Replay Animation?'));
  replay.classList.add('button');
  replay.addEventListener('click', function() {
    cleanUp();
    document.timeline.play(playGame());
  });

  screen.appendChild(text);
  screen.appendChild(replay);
  field.appendChild(screen);

  return new Animation(screen, [{visibility: 'visible', color: '#333',
    backgroundColor: '#CCC'}], 1);
}

/**
 * Cleans up the DOM to replay the animation.
 */
function cleanUp() {
  // Remove all the blocks.
  var grid = document.getElementById('grid');
  var children = Array.prototype.slice.call(grid.childNodes);
  children.forEach(function(child) {
    grid.removeChild(child);
  });
  var screen = document.querySelector('.screen');
  screen.remove();
}

/**
 * Sets up and returns the entire animation of the breakout game.
 */
function playGame() {
  return new SeqGroup([setUp(), playAnimation(document.getElementById('ball'),
        document.getElementById('paddle')), gameOver()]);
}

function movePaddle(event) {
  var field = document.getElementById('field');
  event = event || window.event;              // For IE.

  // Gets mouse pointer position relative to the field.
  function getPointerX(event) {
    return event.clientX - field.offsetLeft;
  }
  // Move the paddle to the same position.
  var pointerX = getPointerX(event);
  paddle['left'] = pointerX - paddle.clientWidth / 2;
  paddle['left'] = Math.min(paddle['left'], field['right'] -
      paddle.clientWidth);
  paddle['left'] = Math.max(paddle['left'], field['left']);
  updatePosition(paddle, paddle['left'], paddle['top']);
  paddle.style.webkitTransform = 'translateX(' + paddle['left'] + 'px)';
};

window.addEventListener('load', function() {
  var field = document.getElementById('field');
  var fieldHeight = GRID_HEIGHT * BLOCK_HEIGHT * 3;
  var fieldWidth = GRID_WIDTH * BLOCK_WIDTH;

  // If the field is too big, then calculate size that will fit viewport.
  var viewportHeight = document.documentElement.clientHeight - PADDING;
  var viewportWidth = document.documentElement.clientWidth - PADDING;

  if (fieldHeight > viewportHeight) {
    GRID_HEIGHT = Math.floor(viewportHeight / 3 / BLOCK_HEIGHT);
    field.style.height = viewportHeight;
  } else {
    field.style.height = fieldHeight;
  }

  if (fieldWidth > viewportWidth) {
    GRID_WIDTH = Math.floor(viewportWidth / BLOCK_WIDTH);
    fieldWidth = GRID_WIDTH * BLOCK_WIDTH;
  }
  field.style.width = fieldWidth;

  // Track touch/mouse pointer movements on the field.
  document.body.addEventListener('pointermove', movePaddle);
  document.body.addEventListener('pointerdown', movePaddle);
  document.timeline.play(playGame());
});

})();
