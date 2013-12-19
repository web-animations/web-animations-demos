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
    this.drawControlHandles(context);
    this.drawTimingFunction(context);
  },
  
 drawTimingFunction: function(context) {
    context.beginPath();
    context.moveTo(0, 0);
    context.bezierCurveTo(this.controlPoints[0], this.controlPoints[1], 
        this.controlPoints[2], this.controlPoints[3], 1, 1);
    context.fillStyle = 'rgba(0,0,0,.6)';
    context.lineWidth = 0.02;
    context.strokeStyle = 'black';
    context.stroke();
    context.closePath();
  },
  
  stringToCoords: function(str) {
    if (str.indexOf('cubic-bezier(') != -1) {
      return str.substring(
          str.indexOf('(')+1, str.indexOf(')')).split(',').map(Number);  
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
  
  drawControlHandles: function(context) {
    var width = this.$.canvas.width;
    var height = this.$.canvas.height;
    
    context.fillStyle = 'rgba(0,0,0,.4)';
    context.lineWidth = 0.01;

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(this.controlPoints[0], this.controlPoints[1]);
    this.$.P1.style.left = this.controlPoints[0] * width + 'px';
    this.$.P1.style.top = (this.controlPoints[1] - 1.5) * height * -0.5 + 'px';
    if (this.controlPoints[1] < -0.5 || this.controlPoints[1] > 1.5) {
      this.$.P1.style.visibility = 'hidden';
    } else {
      this.$.P1.style.visibility = 'inherit';
    }
    context.strokeStyle = 'rgba(133,66,244,1)';
    context.stroke();
    context.closePath();
    
    context.beginPath();
    context.moveTo(1, 1);
    context.lineTo(this.controlPoints[2], this.controlPoints[3]);
    this.$.P2.style.left = this.controlPoints[2] * width + 'px';
    this.$.P2.style.top = (this.controlPoints[3] - 1.5) * height * -0.5 + 'px';
    if (this.controlPoints[3] < -0.5 || this.controlPoints[3] > 1.5) {
      this.$.P2.style.visibility = 'hidden';
    } else {
      this.$.P2.style.visibility = 'inherit';
    }
    context.strokeStyle = 'rgba(0,170,187,1)';
    context.stroke();
    context.closePath();
  },
  
  controlPointsChanged: function() {
    this.updateCanvas();
    this.updateEasing();
  },
  
  updateCanvas: function() {
    var canvas = this.$.canvas;
    var context = canvas.getContext('2d');

    context.clearRect(0, -1.5, canvas.width, canvas.height);
    this.drawLinearEasing(context);
    this.drawControlHandles(context);
    this.drawTimingFunction(context);
  },
  
  drawLinearEasing: function(context) {
    context.lineWidth = 0.02;
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(1, 1);
    context.strokeStyle = 'rgba(0,0,0,.2)';
    context.stroke();
    context.closePath();
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
  },
    
  presetChanged: function() {   
    if (this.preset != 'custom') {
      this.controlPoints = this.easing[this.preset].slice();
    }
  },
  
  moveP1: function() {
    var boundingBox = this.$.canvas.getBoundingClientRect();       
    var root = document.documentElement;
 
    this.preset = 'custom';
 
    this.onmousemove = function drag(e) {
      var x = (e.pageX - boundingBox.left - root.scrollLeft) / 
          boundingBox.width;
      var y = 1.5 - 2 * (e.pageY - boundingBox.top - root.scrollTop) / 
          boundingBox.height;
      
      this.controlPoints[0] = Math.max(Math.min(x.toFixed(2), 1), 0);
      this.controlPoints[1] = parseFloat(y.toFixed(2));
    };
    
    this.onmouseup = function() {
      this.$.P1.blur();
      this.onmousemove = this.onmouseup = null;
    }
  },
  
  moveP2: function() {
    var boundingBox = this.$.canvas.getBoundingClientRect();
    var root = document.documentElement;     

    this.preset = 'custom';

    this.onmousemove = function drag(e) {
      var x = (e.pageX - boundingBox.left - root.scrollLeft) / 
          boundingBox.width;
      var y = 1.5 - 2 * (e.pageY - boundingBox.top - root.scrollTop) / 
          boundingBox.height;
      
      this.controlPoints[2] = Math.max(Math.min(x.toFixed(2), 1), 0);
      this.controlPoints[3] = parseFloat(y.toFixed(2));
    };
    
    this.onmouseup = function() {
      this.$.P2.blur();
      this.onmousemove = this.onmouseup = null;
    }
  },
  
  selectPoint: function(e) {
    var distance = function(x1, y1, x2, y2) {
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    };
    var boundingBox = this.$.canvas.getBoundingClientRect();
    var x = (e.pageX - boundingBox.left) / boundingBox.width;
    var y = 1.5 - 2 * (e.pageY - boundingBox.top) / boundingBox.height;
    
    var distP1 = distance(x, y, this.controlPoints[0], this.controlPoints[1]);
    var distP2 = distance(x, y, this.controlPoints[2], this.controlPoints[3]);
    
    if (distP1 <= distP2) {
      this.controlPoints[0] = Math.max(Math.min(x.toFixed(2), 1), 0);
      this.controlPoints[1] = parseFloat(y.toFixed(2));
    } else {
      this.controlPoints[2] = Math.max(Math.min(x.toFixed(2), 1), 0);
      this.controlPoints[3] = parseFloat(y.toFixed(2));   
    }
    
    this.preset = 'custom';
  }
});

