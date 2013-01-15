/*
 * preload.js
 *
 * Copyright (c) 2012 'PerfectWorks' Ethan Zhang
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt/blob/master/LICENSE-MIT
 */

/*jslint node: true, vars: true, nomen: true, indent: 4, plusplus: true, sloppy: true*/

module.exports = function (grunt) {
    var path = require('path');
    var _ = require('underscore');
    var SourceMap = require('source-map');

    grunt.registerMultiTask('preload', 'Preload js files to fileName.preload.js', function () {
        var src = this.data.src || '';
        var dest = this.data.dest || '';
        var files = this.data.files;
        var sourceMapOptions = this.data.sourceMap;

        grunt.file.expandFiles(src + files).forEach(function (jsFile) {
            var modName = jsFile.replace(src, '').replace(/\.js$/, '');

            var preloads = [];
            grunt.file.read(jsFile).replace(/^(?:\s*\*\s*@preload\s+)([0-9\-\.a-zA-Z\/]+)(?:\s*)$/gm, function ($0, $1) {
                preloads.push($1);
            });

            var generator = null;
            if (sourceMapOptions) {
                generator = new SourceMap.SourceMapGenerator({
                    file: modName + '.preload.js',
                    sourceRoot: sourceMapOptions.sourceRoot
                });
            }

            var lineCount = 0;
            var dirname = path.dirname(jsFile);
            var code = preloads.reduce(function (memo, preload) {
                var fullPath = path.join(dirname, preload);
                var content = grunt.file.read(fullPath).replace(/\r\n/g, '\n').replace(/\r/g, '\n');

                if (generator) {
                    var i = 0;
                    var length = content.split('\n').length;
                    for (i = 0; i < length; i++) {
                        generator.addMapping({
                            generated: {
                                line: lineCount + i + 1,
                                column: 0
                            },
                            original: {
                                line: i + 1,
                                column: 0
                            },
                            source: fullPath.replace(src, '')
                        });
                    }

                    lineCount += length;
                }

                return memo + ';' + content;
            }, '');

            if (sourceMapOptions) {
                grunt.file.write(jsFile.replace(src, dest).replace(/\.js$/, '.preload.js.map'), generator.toString());

                code += '\n//@ sourceMappingURL=' + modName + '.preload.js.map';
            }

            grunt.file.write(jsFile.replace(src, dest).replace(/\.js$/, '.preload.js'), code);
            grunt.log.writeln('Preload ' + (modName + '.preload').cyan + ' created');
        });
    });
};
