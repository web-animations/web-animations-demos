window.addEventListener('WebComponentsReady', function() {
  var stick = document.getElementById('stick');
  var stage = document.getElementById('stage');
  var rightArrowKey = 39;
  var leftArrowKey = 37;
  var upArrowKey = 38;
  var downArrowKey = 40;
  var height = 300;
  stick.height = height + 'px';

  var stageAnim = new Animation(stage, [
        {transform: 'translateX(-40px)', composite: 'add'}
    ], {duration: 0.5, iterations: Infinity});
  var stagePlayer = document.timeline.play(stageAnim);
  stagePlayer.paused = true;

  document.addEventListener('keydown', function(e) {
    if (e.keyCode == rightArrowKey || e.keyCode == leftArrowKey) {
      if (e.keyCode == rightArrowKey) {
        stick.direction = 'right';
        stage.style.webkitTransform = 'scale(1,1)';
      }
      else {
        stick.direction = 'left';
        stage.style.webkitTransform = 'scale(-1,1)';
      }
      stick.walk = true;
      stagePlayer.paused = false;
    }
    else if (e.keyCode == upArrowKey) {
      height *= 1.01;
      stick.height = height + 'px';
      //TODO: Make the speed of the background animation change with
      //      the height of the stick person
    }
    else if (e.keyCode == downArrowKey) {
      height /= 1.01;
      stick.height = height + 'px';
    }
  });

  document.addEventListener('keyup', function(e) {
    if (e.keyCode == 39 || e.keyCode == 37) {
      stick.walk = false;
      stagePlayer.paused = true;
    }
  });

  stick.addEventListener('click', function() {
    var randomHexColour = (Math.floor(Math.random() * 0xffffff)).toString(16);
    stick.style.backgroundColor = '#' + randomHexColour;
  });
});
