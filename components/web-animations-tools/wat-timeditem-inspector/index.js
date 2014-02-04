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

'use strict';

document.addEventListener('polymer-ready', function() {
  var anim1 = new Animation(document.querySelector('#box1'),
      {left: 'calc(100% - 60px)'},
      {duration: 2, easing: 'ease-in'}
  );

  var anim2 = new Animation(document.querySelector('#box2'),
      {left: 'calc(100% - 60px)'},
      {duration: 2, easing: 'ease-out'}
  );

  var animation = new ParGroup([anim1, anim2]);

  document.querySelectorAll('wat-timeditem-inspector')[0].timedItem = anim1;
  document.querySelectorAll('wat-timeditem-inspector')[1].timedItem = anim2;

  var player = document.timeline.play(animation);
  document.querySelector('wat-player-controls').player = player;
});

