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

function serializeTimedItem(timedItem, indent) {
  if (indent === undefined) {
    indent = '';
  }
  var indents = [];
  return timedItemToJs(timedItem);

  function pushIndent(newIndent) {
    indents.push(indent);
    indent = indent + newIndent;
  }
  function popIndent() {
    indent = indents.pop();
  }
  function isMultiLine(s) {
    return s.indexOf('\n') >= 0;
  }
  function isIndented(s) {
    return s[0] == ' ';
  }
  function timedItemToJs(timedItem) {
    if (timedItem instanceof Animation) {
      return animationToJs(timedItem);
    } else if (timedItem instanceof SeqGroup) {
      return groupToJs('SeqGroup', timedItem);
    } else if (timedItem instanceof ParGroup) {
      return groupToJs('ParGroup', timedItem);
    }
  }
  function animationToJs(animation) {
    var result = '';
    result += 'new Animation(' + elementToJs(animation.target) + ', ';
    result += effectToJs(animation.effect) + ', ';
    result += timingToJs(animation.specified) + ')';
    return result;
  }
  function groupToJs(constructor, group) {
    var result = '';
    result += 'new ' + constructor + '(';
    var children = '[]';
    if (group.children.length > 0) {
      var children = '[\n';
      pushIndent('  ');
      for (var i = 0; i < group.children.length; i++) {
        children += indent + timedItemToJs(group.children[i]) + ',\n';
      }
      children += ']';
      popIndent();
    }
    var timing = timingToJs(group.specified);
    if (children != '[]' || timing != '{}') {
      result += children;
      if (timing != '{}') {
        result += ', ' + timing;
      }
    }
    result += ')';
    return result;
  }
  function effectToJs(effect) {
    if (effect instanceof KeyframeEffect) {
      return keyframeEffectToJs(effect);
    }
    if (effect instanceof MotionPathEffect) {
      return 'null /* TODO: MotionPathEffect */';
    }
    if (effect instanceof Function) {
      return 'null /* TODO: function() */';
    }
    return null;
  }
  function keyframeEffectToJs(effect) {
    var needsConstructor = effect.composite != 'replace' &&
        effect.accumulate != 'none';
    var result = '';
    if (needsConstructor) {
      result += 'new KeyframeEffect(';
    }
    var frames = effect.getFrames();
    result += '[';
    for (var i = 0; i < frames.length; i++) {
      pushIndent('  ');
      var frameString = objectToJs(frames[i], normalizeKeyframeProperty);
      if (!isMultiLine(frameString)) {
        result += '\n' + indent;
      }
      popIndent();
      result += frameString;
      if (i != frames.length - 1) {
        result += ', ';
      } else if (!isMultiLine(frameString)) {
        result += '\n' + indent;
      }
    }
    result += ']';
    if (needsConstructor) {
      if (effect.composite != 'replace') {
        result += ', ' + valueToJsLiteral(effect.composite);
      }
      if (effect.accumulate != 'none') {
        result += ', ' + valueToJsLiteral(effect.accumulate);
      }
      result += ')';
    }
    return result;
  }
  function timingToJs(timing) {
    var result = objectToJs(timing, normalizeTimingProperty);
    if (!isMultiLine(result) && timing.duration != null &&
        timing.duration != 'auto') {
      return valueToJsLiteral(timing.duration);
    }
    return result;
  }
  function normalizeKeyframeProperty(property, value) {
    if (value === null || value === undefined) {
      return undefined;
    }
    return value;
  }
  function normalizeTimingProperty(property, value) {
    if (value === null || value === undefined) {
      return undefined;
    }
    switch (property) {
      case 'delay':
      case 'endDelay':
      case 'iterationStart':
        if (Number(value) == 0) {
          return undefined;
        }
        return value;
      case 'iterations':
      case 'playbackRate':
        if (Number(value) == 1) {
          return undefined;
        }
        return value;
      case 'fill':
      case 'duration':
        if (value == 'auto') {
          return undefined;
        }
        return value;
      case 'direction':
        if (value == 'normal') {
          return undefined;
        }
        return value;
      case 'easing':
        if (value == 'linear') {
          return undefined;
        }
        return value;
      case 'easingTimes':
        if (value == 'distribute') {
          return undefined;
        }
        return value;
      default:
        return undefined;
    }
  }
  function objectToJs(object, normalize) {
    var normalized = {};
    var properties = 0;
    for (var k in object) {
      var value = object[k];
      var normalizedValue = normalize(k, value);
      if (normalizedValue === undefined) {
        continue;
      }
      properties++;
      normalized[k] = value;
    }
    if (properties == 0) {
      return '{}';
    }
    var result = '{';
    if (properties > 1) {
      result += '\n';
    }
    for (var k in normalized) {
      if (properties > 1) {
        result += indent + '  ';
      }
      result += stringToJsProperty(k) + ': ' + valueToJsLiteral(normalized[k]);
      if (properties > 1) {
        result += ',\n';
      }
    }
    if (properties > 1) {
      result += indent;
    }
    result += '}';
    return result;
  }
  function elementToJs(element) {
    if (element == null) {
      return 'null';
    }
    if (element.id !== undefined) {
      return 'document.querySelector(' + valueToJsLiteral('#' +
          String(element.id)) + ')';
    }
    return 'null /* Warning: Target does not specify an ID. */';
  }
  function valueToJsLiteral(value) {
    if (typeof value == 'number') {
      return String(value);
    }
    if (typeof value == 'string') {
      var result = '\'' + value.
          replace(/\n/g, '\\n').
          replace(/'/g, '\\\'') + '\'';
      return result;
    }
    return 'null /* Warning: Value was not string or number. */';
  }
  function stringToJsProperty(value) {
    value = String(value);
    if (/^[a-z$_]+[a-z0-9$_]*$/i.test(value)) {
      return value;
    }
    return valueToJsLiteral(value);
  }
}
