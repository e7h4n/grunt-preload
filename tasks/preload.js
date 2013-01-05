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
    var UglifyJS = require('uglify-js');

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

            var dirname = path.dirname(jsFile);
            preloads = preloads.map(function (preload) {
                return path.join(dirname, preload);
            });

            var options = {
                compress: false
            };
            if (sourceMapOptions) {
                options.outSourceMap = path.basename(jsFile).replace(/\.js$/, '.preload.js');
                options.sourceRoot = sourceMapOptions.sourceRoot;
            }

            var result = UglifyJS.minify(preloads, options);
            var code = result.code;

            if (sourceMapOptions) {
                var map = JSON.parse(result.map);
                map.sources = map.sources.map(function (source) {
                    return source.replace(src, '');
                });
                grunt.file.write(jsFile.replace(src, dest).replace(/\.js$/, '.preload.js.map'), JSON.stringify(map));

                code += '\n//@ sourceMappingURL=' + modName + '.preload.js.map';
            }

            grunt.file.write(jsFile.replace(src, dest).replace(/\.js$/, '.preload.js'), code);
            grunt.log.writeln('Preload ' + (modName + '.preload').cyan + ' created');
        });
    });
};
