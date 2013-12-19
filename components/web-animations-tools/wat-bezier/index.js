/*
 * Copyright 2013 Google Inc. All Rights Reserved.
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

"use strict";

document.addEventListener('WebComponentsReady', function() {
  var P1x = 0;
  var P1y = 0;
  var P2x = 1;
  var P2y = 1;
  var cb = 'cubic-bezier(' + P1x + ', ' + P1y + ', ' + P2x + ', ' + P2y + ')';

  var linear = new Animation(document.querySelector('#box-linear'),
      {left: '490px'},
      {duration: 2.5, easing: 'linear'}
  );

  var custom = new Animation(document.querySelector('#box-custom'),
      {left: '490px'},
      {duration: 2.5, easing: cb}
  );

  var animation = new ParGroup([linear, custom]);
  
  document.querySelector('#bezier').target = custom;

  document.querySelector('#player-controls').addEventListener(
      'initialize-player',
      function(event) {
        event.detail.player = document.timeline.play(animation);  
      });
});

