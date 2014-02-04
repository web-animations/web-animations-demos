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

Polymer('wat-wat', {
  selected: null,
  message: '',
  theme: 'github',
  showGutter: true,
  tabSize: 2,
  useWrapMode: true,
  showPrintMargin: true,
  themeOptions: ['ambiance', 'chaos', 'chrome', 'clouds', 'clouds_midnight',
      'cobalt', 'crimson_editor', 'dawn', 'dreamweaver', 'eclipse', 'github',
      'idle_fingers', 'katzenmilch', 'kr_theme', 'kuroir', 'merbivore',
      'merbivore_soft', 'mono_industrial', 'monokai', 'pastel_on_dark',
      'solarized_dark', 'solarized_light', 'terminal', 'textmate', 'tomorrow',
      'tomorrow_night', 'tomorrow_night_blue', 'tomorrow_night_bright',
      'tomorrow_night_eighties', 'twilight', 'vibrant_ink', 'xcode'],
  
  ready: function() {
    this.$.dockRight.collapsed = window.localStorage['wat-dock-right-collapsed'] === undefined ? 
        false : JSON.parse(window.localStorage['wat-dock-right-collapsed']);
    this.$.dockBottom.collapsed = window.localStorage['wat-dock-bottom-collapsed'] === undefined ? 
        false : JSON.parse(window.localStorage['wat-dock-bottom-collapsed']);
    this.theme = window.localStorage['wat-theme'] || 'github';
    this.showGutter = window.localStorage['wat-show-gutter'] === undefined ? 
        true : JSON.parse(window.localStorage['wat-show-gutter']);
    this.tabSize = window.localStorage['wat-tab-size'] === undefined ? 
        2 : parseInt(window.localStorage['wat-tab-size']);
    this.useWrapMode = window.localStorage['wat-use-wrap-mode'] === undefined ? 
        true : JSON.parse(window.localStorage['wat-use-wrap-mode']);
    this.showPrintMargin = window.localStorage['wat-show-print-margin'] === undefined ? 
        true : JSON.parse(window.localStorage['wat-show-print-margin']);
    this.addEventListener('files-loaded', function(event) {
      var files = event.detail;

      if (files['animation.js']) {
        this.$['wat-code-editor'].javascript = files['animation.js'].content;
      }
      if (files['animation.html']) {
        this.$['wat-code-editor'].html = files['animation.html'].content;
      }
      if (files['animation.css']) {
        this.$['wat-code-editor'].css = files['animation.css'].content;
      }

      this.$['wat-code-editor'].updatePreview();
    });

    this.addEventListener('token-changed', function(event) {
      this.loadAnimation();
    }.bind(this));

    this.loadAnimation();
  },

  observe: {
    '$.dockRight.collapsed': 'dockRightCollapsedChanged',
    '$.dockBottom.collapsed': 'dockBottomCollapsedChanged'
  },

  dockRightCollapsedChanged: function() {
    window.localStorage['wat-dock-right-collapsed'] = this.$.dockRight.collapsed;
  },

  dockBottomCollapsedChanged: function() {
    window.localStorage['wat-dock-bottom-collapsed'] = this.$.dockBottom.collapsed;
  },

  themeChanged: function() {
    window.localStorage['wat-theme'] = this.theme;
  },

  showGutterChanged: function() {
    window.localStorage['wat-show-gutter'] = this.showGutter;
  },

  tabSizeChanged: function() {
    window.localStorage['wat-tab-size'] = this.tabSize;
  },

  useWrapModeChanged: function() {
    window.localStorage['wat-use-wrap-mode'] = this.useWrapMode;
  },

  showPrintMarginChanged: function() {
    window.localStorage['wat-show-print-margin'] = this.showPrintMargin;
  },

  restoreDefaultSettings: function() {
    this.theme = 'github';
    this.showGutter = true;
    this.tabSize = 2;
    this.useWrapMode = true;
    this.showPrintMargin = true;
  },

  toggleMenuVisibility: function() {
    this.$['wat-menu'].toggleVisible();
  },

  newAnimation: function() {
    this.toggleMenuVisibility();
    window.location.hash = '';
    this.$['wat-code-editor'].clearAll();
  },

  save: function(saveAsNew) {
    this.toggleMenuVisibility();
    this.$['wat-code-editor'].saveFilesToLocalStorage();

    var javascript = this.$['wat-code-editor'].javascript;
    var html = this.$['wat-code-editor'].html;
    var css = this.$['wat-code-editor'].css;
    var description = 'wat';
    var publicGist = false;
    var files = {};

    if (javascript) {
      files['animation.js'] = {'content': javascript};
    }
    if (html) {
      files['animation.html'] = {'content': html};
    }
    if (css) {
      files['animation.css'] = {'content': css};
    }
    
    if (!saveAsNew && window.location.hash.length > 0) {
      var id = window.location.hash.substring(1);
      this.$.github.update(id, description, publicGist, files);
    } else {
      this.$.github.save(description, publicGist, files);
    }
  },

  saveAnimation: function() {
    var saveAsNew = !this.$.github.signedIn;

    this.save(saveAsNew);
  },

  saveNewAnimation: function() {
    this.save(true);
  },

  loadAnimation: function() {
    this.$['wat-code-editor'].loadFilesFromLocalStorage();
    if (window.location.hash.length > 0) {
      var id = window.location.hash.substring(1);
      this.$.github.load(id);
    }
  },

  signIn: function() {
    this.toggleMenuVisibility();
    this.$.github.signIn();
  },

  signOut: function() {
    this.$.github.signOut();
  }
});