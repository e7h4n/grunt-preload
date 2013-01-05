module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: '<json:package.json>',

        watch: {
            files: '<config:jslint.files>',
            tasks: 'test'
        },

        copy: {
            dist: {
                files: {
                    'test/dist/': 'test/src/**/*.js'
                }
            }
        },

        jslint: {
            files: [
                'lib/**/*.js',
                'test/**/*.js'
            ],

            exclude: [
                'test/dist/**/*.js'
            ],

            directives: {
                unparam: true,
                unused: true,
                node: true,
                vars: true,
                nomen: true,
                indent: 4,
                plusplus: true,
                sloppy: true
            },

            options: {
                errorsOnly: true
            }
        },

        preload: {
            testMap: {
                sourceMap: {
                    sourceRoot: '/src/'
                },
                src: 'test/src/',
                dest: 'test/dist/',
                files: '*.js'
            },
            test: {
                src: 'test/src/',
                dest: 'test/dist/',
                files: '*.js'
            }
        },

        server: {
            port: 8990,
            base: 'test/'
        },

        qunit: {
            all: [
                'http://localhost:8990/test.html'
            ]
        }
    });

    grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('test', 'copy preload server qunit');
};
