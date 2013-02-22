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
        var options = this.options();
        var sourceMapOptions = options.sourceMap;

        console.log("this.files[0].src:", this.files[0].src);
        this.files.forEach(function (file) {
            var jsFile = file.src[0];
            var modName = jsFile.replace(file.orig.cwd, '').replace(/\.js$/, '');

            var preloads = [];
            grunt.file.read(jsFile).replace(/^(?:\s*\*\s*@preload\s+)([0-9\-\.a-zA-Z\/]+)(?:\s*)$/gm, function ($0, $1) {
                preloads.push($1);
            });

            var generator = null;
            if (sourceMapOptions) {
                generator = new SourceMap.SourceMapGenerator({
                    file: modName + file.orig.ext,
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
                            source: fullPath.replace(file.orig.cwd, '')
                        });
                    }

                    lineCount += length;
                }

                return memo + ';' + content;
            }, '');

            if (sourceMapOptions) {
                grunt.file.write(jsFile.replace(file.orig.cwd, file.orig.dest).replace(/\.js$/, file.orig.ext + '.map'), generator.toString());

                code += '\n//@ sourceMappingURL=' + modName + file.orig.ext + '.map';
            }

            grunt.file.write(file.dest, code);
            grunt.log.writeln('Preload ' + jsFile.cyan + ' -> ' + file.dest.cyan);
        });
    });
};
