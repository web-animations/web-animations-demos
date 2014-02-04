/*
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict;'

Polymer('wat-keyframe-inspector', {
  // This is the keyframe effect object.
  effect: null,
  
  // These are the frames and properties currently being edited.
  frames: null,
  properties: null,

  // It record all seen properties in the keyframes to prevent redundant properties.
  // We can achieve the same effect by searching through the properties array
  // but we already generate this map in initialization so we can just use it.
  seenProperties: null,

  // When effect is changed, update the fields to reflect the changes.
  effectChanged: function(oldValue, newValue) {
    var frames = this.effect.getFrames();

    // We need to loop through the frames to get all the properties
    // because each frame may only have a subset.
    var seenProperties = {};
    var properties = [];

    for (var i = 0; i < frames.length; i++) {
      for (var prop in frames[i]) {
            
        if (seenProperties[prop]) {
          continue;
        }

        seenProperties[prop] = true;
        properties.push(prop);
      }
    }

    this.frames = frames;
    this.properties = properties;
    this.seenProperties = seenProperties;
  },
  
  cellValueChanged: function(e) {
    // Find the corresponding frame and property of the changing cell.
    var frameIndex = e.target.dataset['column'];
    var propIndex = e.target.dataset['row'];

    var prop = this.properties[propIndex];
    var frame = this.frames[frameIndex];

    var value = e.target.value;
    if (prop === 'offset') {
      value = parseFloat(value);
    }
    frame[prop] = value;

    this.effect.setFrames(this.frames);
  },

  gainFocus: function(e) {
    // The input element gets the focus but the parent get highlighted.
    var cell = e.target.parentNode;

    cell.animate([
      {transform:'scale(1)'},
      {transform:'scale(1.1)'}, 
      {transform:'scale(1)'}
    ], 0.1);

    cell.classList.toggle('focused-cell', true);
  },

  loseFocus: function(e) {
    // The input element gets the focus but the parent get highlighted.
    var cell = e.target.parentNode;
    cell.classList.toggle('focused-cell', false);
  },

  actionOnFrame: function(e) {
    var action = this.getAction(e);
    if (!action) {
      return;
    }

    // Get the index of the header on which the action being performed.
    var index = parseInt(e.target.dataset['index']);
    
    if (action === 'insert') {
      // We decide to insert an empty frame AFTER 
      // the current frame and that is where the +1 come from.
      this.frames.splice(index + 1, 0, {});
    } else if (action === 'delete') {
      this.frames.splice(index, 1);
    }

    this.effect.setFrames(this.frames);
  },

  actionOnProperty: function(e) {
    var ENTER_KEY_CODE = 13;
    var action;

    if (e.type === 'keyup' && e.keyCode === ENTER_KEY_CODE) {
      action = 'insert';
    } else {
      action = this.getAction(e);
    }

    if (action !== 'insert' && action !== 'delete') {
      return;
    }
  
    if (action === 'insert') {
      var prop = e.target.value;
      if (this.seenProperties[prop]) {
        return;
      }

      this.properties.push(prop);

      // Reset the input element back to empty.
      e.target.value = '';

    } else if (action === 'delete') {
      var index = parseInt(e.target.dataset['index']);
      var prop = this.properties[index];
      
      this.properties.splice(index, 1);
      // Remove the property from all the frames.
      for (var i = 0; i < this.frames.length; i++) {
        delete this.frames[i][prop];
      }
    }

    this.effect.setFrames(this.frames);
  },

  getAction: function(e) {
    var INSERT_KEY_CODE = 45;
    var DELETE_KEY_CODE = 46;

    if (e.type === 'click') {
      return e.target.dataset['action'];
    }

    if (e.type === 'keyup') {
      switch(e.keyCode) {
        case INSERT_KEY_CODE: 
          return 'insert';
        case DELETE_KEY_CODE: 
          return 'delete';
        default:
          return null;
      }
    }
  } 
});