Polymer('wat-bezier', {
  controlPoints: [0, 0, 1, 1], // [P1x, P1y, P2x, P2y]
  target: new Animation(null, null, 0),
  preset: 'linear',
  
  easing: {
    'linear': [0, 0, 1, 1],
    'ease': [0.25, 0.1, 0.25, 1],
    'ease-in': [0.42, 0, 1, 1],
    'ease-out': [0, 0, 0.58, 1],
    'ease-in-out': [0.42, 0, 0.58, 1],
  },
     
  observe: {
    'target.specified.easing': 'targetEasingChanged',
  },
  
  ready: function() {
    var canvas = this.$.canvas;
    var context = canvas.getContext('2d');
    context.scale(canvas.width, -0.5 * canvas.height);
    context.translate(0, -1.5);
  },
  
  stringToCoords: function(str) {
    if (str.indexOf('cubic-bezier(') != -1) {
      return str.substring(
          str.indexOf('(') + 1, str.indexOf(')')).split(',').map(Number);
    } else {
      return this.easing[str];
    }
  },
  
  coordsToString: function(coords) {
    for (var t in this.easing) {
      if (this.easing[t].toString() == coords.toString()) {
        this.preset = t;
        return t;  
      }
    }
    this.preset = 'custom';
    return 'cubic-bezier(' + coords[0] + ',' + coords[1] + ',' + coords[2] + 
        ',' + coords[3] + ')';
  },
  
  updateCanvas: function() {
    var canvas = this.$.canvas;
    var context = canvas.getContext('2d');

    context.clearRect(0, -1.5, canvas.width, canvas.height);

    // Linear guide.
    context.lineWidth = 0.02;
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(1, 1);
    context.strokeStyle = 'silver';
    context.stroke();
    context.closePath();

    var p1Color = 'rgba(133,66,244,1)';
    var p2Color = 'rgba(0,170,187,1)';

    // Control points.
    context.lineWidth = 0.01;

    // P1 line.
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(this.controlPoints[0], this.controlPoints[1]);
    context.strokeStyle = p1Color;
    context.stroke();

    // P2 line.
    context.beginPath();
    context.moveTo(1, 1);
    context.lineTo(this.controlPoints[2], this.controlPoints[3]);
    context.strokeStyle = p2Color;
    context.stroke();

    // Timing function.
    context.beginPath();
    context.moveTo(0, 0);
    context.bezierCurveTo(this.controlPoints[0], this.controlPoints[1],
        this.controlPoints[2], this.controlPoints[3], 1, 1);
    context.lineWidth = 0.02;
    context.strokeStyle = 'black';
    context.stroke();
    context.closePath();

    // P2 handle.
    context.beginPath();
    context.arc(this.controlPoints[0], this.controlPoints[1], 0.03, 0, Math.PI * 2, false);
    context.strokeStyle = 'black';
    context.lineWidth = 0.01;
    context.stroke();
    context.fillStyle = p1Color;
    context.fill();

    // P2 handle.
    context.beginPath();
    context.arc(this.controlPoints[2], this.controlPoints[3], 0.03, 0, Math.PI * 2, false);
    context.strokeStyle = 'black';
    context.lineWidth = 0.01;
    context.stroke();
    context.fillStyle = p2Color;
    context.fill();
  },
  
  controlPointsChanged: function() {
    this.updateCanvas();
    this.updateEasing();
  },
 
  updateEasing: function() {
    if (this.target && this.target.specified) {
      this.target.specified.easing = 
          this.coordsToString(this.controlPoints);
    }
  },
  
  targetEasingChanged: function() {
    this.controlPoints = 
        this.stringToCoords(this.target.specified.easing).slice();
    for (var t in this.easing) {
      if (this.easing[t].toString() == this.controlPoints.toString()) {
        this.preset = t;
        return;
      }
    }
    this.preset = 'custom';
  },
    
  presetChanged: function() {   
    if (this.preset != 'custom') {
      this.controlPoints = this.easing[this.preset].slice();
    }
  },

  pointers: {},
  pointerDown: function(e) {
    e.target.setPointerCapture(e.pointerId);
    this.pointers[e.pointerId] = true;
    this.pointerMove(e);
    e.preventDefault();
  },
  
  pointerUp: function(e) {
    this.pointers[e.pointerId] = false;
    e.target.releasePointerCapture(e.pointerId);
  },
  
  pointerMove: function(e) {
    if (!this.pointers[e.pointerId])
      return;

    var distance = function(x1, y1, x2, y2) {
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    };
    var boundingBox = this.$.canvas.getBoundingClientRect();
    var x = (e.clientX - boundingBox.left) / boundingBox.width;
    var y = 1.5 - 2 * (e.clientY - boundingBox.top) / boundingBox.height;
    
    var distP1 = distance(x, y, this.controlPoints[0], this.controlPoints[1]);
    var distP2 = distance(x, y, this.controlPoints[2], this.controlPoints[3]);
    
    if (distP1 <= distP2) {
      this.controlPoints[0] = Math.max(Math.min(x.toFixed(3), 1), 0);
      this.controlPoints[1] = parseFloat(y.toFixed(3));
    } else {
      this.controlPoints[2] = Math.max(Math.min(x.toFixed(3), 1), 0);
      this.controlPoints[3] = parseFloat(y.toFixed(3));
    }
  }
});
