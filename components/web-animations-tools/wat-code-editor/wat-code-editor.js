/*
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

Polymer('wat-code-editor', {
  mode: 'columns',
  html: '',
  css: '',
  javascript: '',

  ready: function() {
    this.selected = ['html', 'css', 'javascript'];
    this.updatePreview();
  },

  observe: {
    html: 'updatePreview'
  },

  toggle: function() {
    this.mode = this.mode == 'columns' ? 'rows' : 'columns';
  },

  cssChanged: function() {
    this.previewStyle.textContent = this.css;
  },

  selectedChanged: function() {
    var editors = [this.$.javascript, this.$.html, this.$.css];
    var visible = [];
    
    editors.forEach(function(editor) {
      var hidden = !this.selected || this.selected.indexOf(editor.id) < 0;
      if (hidden) {
        editor.setAttribute('hidden', null);
      } else {
        editor.removeAttribute('hidden');
        visible.push(editor);
      }
    }.bind(this));
    
    if (visible.length == 0) {
      this.$.container2.setAttribute('hidden', null);
    } else {
      this.$.container2.removeAttribute('hidden');
      if (visible.length == 1) {
        this.$.container2.appendChild(visible[0]);
      } else if (visible.length == 2) {
        this.$.container2.appendChild(visible[0]);
        this.$.container2.appendChild(visible[1]);
      } else if (visible.length == 3) {
        this.$.container1.appendChild(visible[0]);
        this.$.container2.appendChild(visible[1]);
        this.$.container2.appendChild(visible[2]);
      }
    }
    this.style.display = 'none';
    this.offsetTop; // FIXME (once Chrome is fixed)
    this.style.display = '';
  },

  timedItemChanged: function(oldValue, newValue) {
    if (!oldValue) {
      this.updateCode();
    }
  },

  updateCode: function() {
    this.javascript = 'document.timeline.play(' +
        serializeTimedItem(this.timedItem) + ');';
  },

  updatePreview: function() {
    var preview = this.$['preview-frame'];
    preview.src = '../../polymer-animation/web-animations.html';

    preview.onload = function() {
      var w = preview.contentWindow;
      var d = preview.contentWindow.document;

      var content = d.createElement('div');
      content.innerHTML = this.html;
      d.body.appendChild(content);
      
      this.previewStyle = d.createElement('style');
      this.previewStyle.textContent = this.css;
      d.body.appendChild(this.previewStyle);

      var script = d.createElement('script');
      script.textContent = this.javascript;
      d.body.appendChild(script);

      if (w.document.timeline.getCurrentPlayers().length > 0) {
        this.$['player-controls'].player =
            w.document.timeline.getCurrentPlayers()[0];
        this.timedItem = this.$['player-controls'].player.source;
        window.Animation = w.Animation;
        window.ParGroup = w.ParGroup;
        window.SeqGroup = w.SeqGroup;
        window.KeyframeEffect = w.KeyframeEffect;
        window.MotionPathEffect = w.MotionPathEffect;
      } else {
        alert('Could not find any active players.');
      }
    }.bind(this);
  }
});