Polymer('wat-step', {
  steps: 1,
  position: 'end',
  preset: 'custom',
  stepEasings: ['step-start', 'step-middle', 'step-end', 'steps'],
  disabled: false,
  
  easing: {
    'step-start': {steps: 1, position: 'start'},
    'step-middle': {steps: 1, position: 'middle'},
    'step-end': {steps: 1, position: 'end'}
  },
     
  observe: {
    'steps': 'updateTimingFunction',
    'position': 'updateTimingFunction',
    'timedItem.specified.easing': 'timedItemEasingChanged',
  },

  created: function() {
    this.timedItem = new Animation(null, null, 0);
  },
  
  ready: function() {
    var canvas = this.$.canvas;
    var context = canvas.getContext('2d');

    context.translate(12.5, canvas.height - 12.5);
    context.scale(canvas.width - 25, 25 - canvas.height);
    this.drawTimingFunction(context);
    this.updateEasing();
  },

  disabledChanged: function() {
    var canvas = this.$.canvas;
    var context = canvas.getContext('2d');

    if (this.disabled) {
      this.$.steps.disabled = true;
      this.$.position.disabled = true;
      this.$.preset.disabled = true;
      this.preset = 'custom';
      context.save();
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.restore();
    } else {
      this.$.steps.disabled = false;
      this.$.position.disabled = false;
      this.$.preset.disabled = false;
      this.drawTimingFunction(context);
      this.updateEasing();
    }
  },
  
  drawTimingFunction: function(context) {
    var radius = Math.min(0.01, 0.1 / this.steps);
    var start = 0;
    var end = 2 * Math.PI;
    var counterclockwise = true; 
    /* 1 : (multiplier - 1) is the ratio of the radius of the circles to the 
       lineWidth of the dashed lines and the open circles */
    var multiplier = 1.25;
    
    context.beginPath();
    context.strokeStyle = context.fillStyle = 'blue';
    context.setLineDash([0]);
    context.lineCap = 'butt';
    context.lineWidth = radius;
    
    var xShift = 0;
    var yShift = 0;
    var iStart = 0;
    
    if (this.position == 'start') {
      yShift = 1 / this.steps;
    }
    if (this.position == 'middle') {
      iStart = 1;
      xShift = -0.5 / this.steps;
      context.moveTo(0, 0);
      context.arc(0, 0, radius, start, end, counterclockwise);
      context.lineTo(0.5 / this.steps - multiplier * radius, 0);
    }
    
    for (var i = iStart; i < this.steps; i++) {
      var x = Math.min(1, Math.max(0, i / this.steps + xShift));
      var y = i / this.steps + yShift;
      
      context.moveTo(x, y);
      context.arc(x, y, radius, start, end, counterclockwise);
      context.lineTo(x + 1 / this.steps - multiplier * radius, y);
    }
    
    if (this.position == 'middle') {
      context.moveTo((this.steps - 0.5) / this.steps, 1);
      context.arc((this.steps - 0.5) / this.steps, 1, radius, start, end,
          counterclockwise); 
      context.lineTo(1 - multiplier * radius, 1);
    }
    
    context.stroke();
    context.fill();
    context.closePath();
    
    context.beginPath();
    context.arc(1, 1, radius, start, end, counterclockwise);
    context.stroke();
    context.fill();
    context.closePath();
    
    this.drawTransitions(context, multiplier * radius, multiplier, start, end, 
        counterclockwise);
  },
  
  drawTransitions: function(context, radius, multiplier, start, end, 
      counterclockwise) {
    
    var xShift = 0;
    
    if (this.position == 'middle') {
      xShift = 0.5 / this.steps;
    }
    if (this.position == 'end') {
      xShift = 1 / this.steps;
    }   
    
    this.drawDashedLines(context, radius, multiplier, xShift);
    this.drawOpenCircles(context, radius, multiplier, start, end, 
        counterclockwise, xShift);
  },
  
  drawDashedLines: function(context, radius, multiplier, xShift) {
    context.beginPath();
    context.strokeStyle = 'blue';
    context.setLineDash([radius]);
    context.lineCap = 'round';
    context.lineWidth = radius * (multiplier - 1); 
    
    for (var i = 0; i < this.steps; i++) {
      var x = i / this.steps + xShift;
      var y = i / this.steps;

      context.moveTo(x, y + radius);
      context.lineTo(x, y + 1 / this.steps - multiplier * radius);
    }
    
    context.stroke();
    context.closePath();
  },
  
  drawOpenCircles: function(context, radius, multiplier, start, end, 
      counterclockwise, xShift) {
      
    context.beginPath();
    context.strokeStyle = 'blue';
    context.setLineDash([0]);
    context.lineCap = 'round';
    context.lineWidth = radius * (multiplier - 1);
    
    for (var i = 0; i < this.steps; i++) {
      var x = i / this.steps + xShift;
      var y = i / this.steps;

      context.moveTo(x + radius, y);
      context.arc(x, y, radius, start, end, counterclockwise);
    }

    context.stroke();
    context.closePath();
  },
  
  stringToProps: function(str) {
    if (str.indexOf('steps(') != -1) {
      var array = str.substring(
          str.indexOf('(')+1, str.indexOf(')')).split(',');
      this.preset = 'custom';
      return {steps: parseInt(array[0]), position: array[1].trim()};  
    } else {
      return this.easing[str];
    }
  },
  
  propsToString: function(stepsPos) {
    for (var t in this.easing) {
      if (this.easing[t].steps == stepsPos.steps && 
          this.easing[t].position == stepsPos.position) {
        this.preset = t;
        return t;  
      }
    }
    this.preset = 'custom';
    return 'steps(' + stepsPos.steps + ', ' + stepsPos.position + ')';
  },
   
  updateTimingFunction: function() {
    this.updateCanvas();
    this.updateEasing();
  },
  
  updateCanvas: function() {
    var canvas = this.$.canvas;
    var context = canvas.getContext('2d');

    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();
    this.drawTimingFunction(context);
  },
  
  updateEasing: function() {
    if (this.timedItem && this.timedItem.specified) {
      this.timedItem.specified.easing = 
          this.propsToString({steps: this.steps, position: this.position});
    }
  },
  
  timedItemEasingChanged: function() {
    if (this.stepEasings.indexOf(this.timedItem.specified.easing) >= 0 ||
        this.timedItem.specified.easing.indexOf('steps') >= 0) {
      var stepsPos = this.stringToProps(this.timedItem.specified.easing);
      
      this.disabled = false;
      this.steps = stepsPos.steps;
      this.position = stepsPos.position;
    } else {
      this.disabled = true;
    }
  },
    
  presetChanged: function() {   
    if (this.preset != 'custom') {
      this.steps = this.easing[this.preset].steps
      this.position = this.easing[this.preset].position;
    }
  }
});

