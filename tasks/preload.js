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

    grunt.registerMultiTask('preload', 'Preload js files to fileName.preload.js', function () {
        var src = this.data.src;
        var dest = this.data.dest;
        var files = this.data.files;

        grunt.file.expandFiles(src + files).forEach(function (jsFile) {
            console.log("jsFile:", jsFile);
            var modName = jsFile.replace(src, '').replace(/\.js$/, '');
            grunt.log.writeln('Preload ' + (modName + '.preload').cyan + ' created');

            var preloads = [];
            grunt.file.read(jsFile).replace(/^(?:\s*\*\s*@preload\s+)([0-9\-\.a-zA-Z\/]+)(?:\s*)$/gm, function ($0, $1) {
                preloads.push($1);
            });

            var dirname = path.dirname(src + jsFile);

            var preload = preloads.reduce(function (memo, preload) {
                return memo + grunt.file.read(path.join(dirname, preload));
            }, '');
            grunt.file.write(jsFile.replace(src, dest).replace(/\.js$/, '.preload.js'), preload);
        });
    });
};
