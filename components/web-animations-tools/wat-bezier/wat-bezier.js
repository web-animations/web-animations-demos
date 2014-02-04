Polymer('wat-bezier', {
  controlPoints: [0, 0, 1, 1], // [P1x, P1y, P2x, P2y]
  preset: 'linear',
  bezierEasings: ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out',],
  disabled: false,
  
  easing: {
    'linear': [0, 0, 1, 1],
    'ease': [0.25, 0.1, 0.25, 1],
    'ease-in': [0.42, 0, 1, 1],
    'ease-out': [0, 0, 0.58, 1],
    'ease-in-out': [0.42, 0, 0.58, 1],
  },
     
  observe: {
    'timedItem.specified.easing': 'timedItemEasingChanged',
  },

  created: function() {
    this.timedItem = new Animation(null, null, 0);
  },
  
  ready: function() {
    var canvas = this.$.canvas;
    var context = canvas.getContext('2d');
    context.translate(15, 0.75 * canvas.height)
    context.scale(canvas.width - 30, -0.5 * canvas.height);
    this.updateCanvas();
    this.updateEasing();
  },

  disabledChanged: function() {
    if (this.disabled) {
      var canvas = this.$.canvas;
      var context = canvas.getContext('2d');

      this.$.P1x.disabled = this.$.P1y.disabled = this.$.P2x.disabled = 
          this.$.P2y.disabled = true;
      this.$.preset.disabled = true;
      this.preset = 'custom';
      context.save();
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.restore();
    } else {
      this.$.P1x.disabled = this.$.P1y.disabled = this.$.P2x.disabled = 
          this.$.P2y.disabled = false;
      this.$.preset.disabled = false;
      this.updateCanvas();
      this.updateEasing();
    }
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

    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();

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

    // P0 (fixed).
    context.beginPath();
    context.arc(0, 0, 0.03, 0, Math.PI * 2, false);
    context.strokeStyle = 'silver';
    context.lineWidth = 0.01;
    context.stroke();
    context.fillStyle = 'white';
    context.fill();

    // P3 (fixed).
    context.beginPath();
    context.arc(1, 1, 0.03, 0, Math.PI * 2, false);
    context.strokeStyle = 'silver';
    context.lineWidth = 0.01;
    context.stroke();
    context.fillStyle = 'white';
    context.fill();

    // P1 handle.
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
    this.controlPoints[0] = Math.max(Math.min(
        parseFloat(this.controlPoints[0]).toFixed(3), 1), 0);
    this.controlPoints[2] = Math.max(Math.min(
        parseFloat(this.controlPoints[2]).toFixed(3), 1), 0);
    this.updateCanvas();
    this.updateEasing();
  },
 
  updateEasing: function() {
    if (this.timedItem && this.timedItem.specified) {
      this.timedItem.specified.easing = 
          this.coordsToString(this.controlPoints);
    }
  },
  
  timedItemEasingChanged: function() {
    if (this.bezierEasings.indexOf(this.timedItem.specified.easing) >= 0 || 
          this.timedItem.specified.easing.indexOf('cubic-bezier') >= 0) {
      this.disabled = false;
      this.controlPoints = 
          this.stringToCoords(this.timedItem.specified.easing).slice();
      for (var t in this.easing) {
        if (this.easing[t].toString() == this.controlPoints.toString()) {
          this.preset = t;
          return;
        }
      }
      this.preset = 'custom';
    } else if (this.timedItem.specified.easing != '') {
      this.disabled = true;
    }
  },
    
  presetChanged: function() {   
    if (this.preset != 'custom') {
      this.controlPoints = this.easing[this.preset].slice();
    }
  },

  pointers: {},
  pointerDown: function(e) {
    if (!this.disabled) {
      e.target.setPointerCapture(e.pointerId);
      this.pointers[e.pointerId] = true;
      this.pointerMove(e);
      e.preventDefault();
    }
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
