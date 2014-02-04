/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

root = '../../';
 
docTheme =
  //'bootstrap' || 
  //'uxa' ||
  'polymerase' ||
  'default'
;

allDocTheme =
  'bootstrap' || 
  //'uxa' ||
  //'polymerase' ||
  'default'
;

module.exports = function (grunt) {
  folder = grunt.option('doc');
  grunt.initConfig({
    yuidoc: {
      compile: {
        name: 'Docs',
        description: 'Docs',
        options: {
          exclude: 'docs,mocha,chai,index.html,smoke.html',
          extension: '.js,.html',
          paths: [
            root + folder
          ],
          outdir: 'data',
          linkNatives: 'true',
          tabtospace: 2,
          themedir: root + 'tools/doc/themes/' + docTheme
        }
      },
      all: {
        name: 'Docs',
        description: 'Docs',
        options: {
          exclude: 'docs,mocha,chai,index.html,smoke.html',
          extension: '.js,.html',
          paths: [
            root
          ],
          outdir: 'docs',
          linkNatives: 'true',
          tabtospace: 2,
          themedir: root + 'tools/doc/themes/' + allDocTheme
        }
      }
    }
  });

  // plugins
  grunt.loadNpmTasks('grunt-contrib-yuidoc');

  // tasks
  grunt.registerTask('default', ['yuidoc:all']);
  grunt.registerTask('compile', ['yuidoc:compile']);
};

