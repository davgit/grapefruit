var path = require('path');

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');

    //explicity set source files because order is important
    var srcFiles = [
        '<%= dirs.src %>/core.js',
        '<%= dirs.src %>/DisplayObject.js',
        '<%= dirs.src %>/utils/utils.js',
        '<%= dirs.src %>/utils/Vector.js',
        '<%= dirs.src %>/audio/audio.js',
        '<%= dirs.src %>/controls/controls.js',
        '<%= dirs.src %>/controls/gamepad.js',
        '<%= dirs.src %>/debug/debug.js',
        '<%= dirs.src %>/entity/Sprite.js',
        '<%= dirs.src %>/entity/Entity.js',
        '<%= dirs.src %>/entity/entityPool.js',
        '<%= dirs.src %>/gui/gui.js',
        '<%= dirs.src %>/gui/hud.js',
        '<%= dirs.src %>/gui/hud/HudItem.js',
        '<%= dirs.src %>/loader/AssetLoader.js',
        '<%= dirs.src %>/map/Map.js',
        '<%= dirs.src %>/map/Layer.js',
        '<%= dirs.src %>/map/tiled/TiledMap.js',
        '<%= dirs.src %>/map/tiled/TiledLayer.js',
        '<%= dirs.src %>/map/tiled/TiledTileset.js',
        '<%= dirs.src %>/map/tiled/TiledObjectGroup.js',
        '<%= dirs.src %>/plugin/plugin.js'
    ], banner = [
        '/**',
        ' * @license',
        ' * <%= pkg.longName %> - v<%= pkg.version %>',
        ' * Copyright (c) 2012, Chad Engler',
        ' * <%= pkg.homepage %>',
        ' *',
        ' * Compiled: <%= grunt.template.today("yyyy-mm-dd") %>',
        ' *',
        ' * <%= pkg.longName %> is licensed under the <%= pkg.license %> License.',
        ' * <%= pkg.licenseUrl %>',
        ' */',
        ''
    ].join('\n');

    //Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dirs: {
            build: 'build',
            docs: 'docs',
            src: 'src',
            test: 'test',
            tools: 'tools',
            vendor: 'vendor'
        },
        files: {
            vendor: '<%= dirs.vendor %>/**/*js',
            srcBlob: '<%= dirs.src %>/**/*.js',
            testBlob: '<%= dirs.test %>/unit/**/*.js',
            intro: '<%= dirs.src %>/intro.js',
            outro: '<%= dirs.src %>/outro.js',
            build: '<%= dirs.build %>/<%= pkg.name %>.js',
            buildMin: '<%= dirs.build %>/<%= pkg.name %>.min.js'
        },
        concat: {
            options: {
                banner: banner
            },
            dist: {
                src: ['<%= files.intro %>', '<%= files.vendor %>'].concat(srcFiles).concat(['<%= files.outro %>']),
                dest: '<%= files.build %>'
            }
        },
        uglify: {
            options: {
                banner: banner,
                mangle: false
            },
            dist: {
                src: '<%= files.build %>',
                dest: '<%= files.buildMin %>'
            }
        },
        jshint: {
            beforeconcat: srcFiles.filter(function(e) { return e.indexOf('debug.js') === -1; }),
            test: ['<%= files.testBlob %>'],
            options: {
                /* Enforcement options */
                bitwise: false,     //allow bitwise operators
                camelcase: false,   //must use camelCase or UPPER_CASE
                curly: false,       //one line conditionals w/o braces are allowed
                eqeqeq: true,       //must use === if possible
                forin: false,       //forin loops much check hasOwnProperty
                immed: true,        //self-calling functions must be wrapped in parens
                latedef: true,      //can't use a variable until it is defined
                newcap: true,       //ctor names must be Captialized
                noarg: true,        //arguments.caller/callee are deprecated, disallow
                noempty: true,      //warn about empty blocks
                nonew: true,        //no using `new Constructor();` without saving the value (no using only side-effects)
                plusplus: false,    //you can use unary increment and decrement operators
                quotmark: true,     //quotes must be consistent
                unused: true,       //warn about declared but not used variables
                strict: false,      //do not require functions to be able to run in strict-mode
                trailing: true,     //help prevent weird whitespace errors in multi-line strings using \ 
                maxlen: 200,        //no line should be longer than 120 characters

                /* Relaxing Options */
                boss: true,        //do not warn about the use of assignments in cases where comparisons are expected

                /* Environments */
                browser: true,      //this runs in a browser :)
                devel: false,       //warn about using console.log and the like
                jquery: false,      //no jquery used here
                node: false,        //no node support...YET! :)
                worker: true,       //web-workers are used

                /* Globals */
                undef: true,
                globals: {
                    /* For tests */
                    requirejs: false,
                    require: false,
                    define: false,
                    QUnit: false,
                    Q: false,
                    $: false,
                    gf: false,

                    /* For the library */
                    PIXI: false
                }
            }
        },
        connect: {
            qunit: {
                options: {
                    port: grunt.option('port-test') || 9002,
                    base: './'
                }
            },
            test: {
                options: {
                    port: grunt.option('port-test') || 9002,
                    base: './',
                    keepalive: true
                }
            }
        },
        qunit: {
            all: {
                options: {
                    urls: ['http://localhost:' + (grunt.option('port-test') || 9002) + '/test/index.html']
                }
            }
        },
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: {
                    paths: '<%= dirs.src %>',
                    outdir: '<%= dirs.docs %>'
                }
            }
        }
    });

    //Load tasks
    grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
    grunt.registerTask('build', ['jshint', 'concat', 'uglify']);
    grunt.registerTask('test', ['concat', 'connect:qunit', 'qunit']);
    grunt.registerTask('docs', ['yuidoc']);
};