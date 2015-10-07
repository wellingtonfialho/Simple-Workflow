module.exports = function(grunt) {
    'use strict';

    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),


        path: {
            dev: 'src',
            dist: 'assets'

        },

        jade: {
            compile: {
                options: {
                    client: false,
                    pretty: true
                },
                files: [{
                    cwd: "<%= path.dev %>/views/pages",
                    src: "*.jade",
                    dest: "./",
                    expand: true,
                    ext: ".html"
                }]
            }
        },

        stylus: {
            compile: {
                options: {
                    paths: ['node_modules/jeet/stylus/'],
                    urlfunc: 'embedurl',
                    compress: false,
                    import: [
                        'nib/*',
                        'jeet/index'
                    ]
                },
                files: {
                    '<%= path.dist %>/css/style.css': '<%= path.dev %>/stylus/style.styl'
                }
            }
        },

        cmq: {
            options: {
                log: false
            },
            your_target: {
                files: {
                    '<%= path.dist %>/css/': ['<%= path.dist %>/css/*.css', '<%= path.dist %>/css/!*.min.css']
                }
            }
        },

        csslint: {
          options: {
            csslintrc: '.csslintrc'
          },
          strict: {
            src: ['<%= path.dist %>/css/*.css', '<%= path.dist %>/css/!*.min.css']
          }
        },

        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: '<%= path.dist %>/css/',
                    src: ['*.css', '!*.min.css'],
                    dest: '<%= path.dist %>/css/',
                    ext: '.min.css'
                }]
            }
        },

        browserSync: {
            bsFiles: {
                src: ['<%= path.dist %>/css/*.css',
                    './*.html',
                    '<%= path.dev %>/views/**/*.jade'
                ]
            },
            options: {
                watchTask: true,
                server: {
                    baseDir: './'
                }
            }
        },

        imagemin: {
            options: {
                optimizationLevel: 7
            },
            dynamic: {
                files: [{
                    expand: true,
                    cwd: '<%= path.dev %>/images/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: '<%= path.dist %>/images/'
                }]
            }
        },

        concat: {
            options: {
                separator: "\n"
            },
            dist: {
                src: [
                    '<%= path.dev %>/javascript/vendor/jquery.js',
                    '<%= path.dev %>/javascript/vendor/modernizr.js',
                    '<%= path.dev %>/javascript/vendor/respond.src.js',
                    '<%= path.dev %>/javascript/vendor/*.js',
                    '<%= path.dev %>/javascript/*.js',
                    '<%= path.dev %>/javascript/main.js'
                ],
                dest: '<%= path.dist %>/javascript/build.js'
            }
        },

        jshint: {
            all: ['Gruntfile.js', '<%= path.dev %>/javascript/main.js']
        },

        uglify: {
            all: {
                files: [{
                    expand: true,
                    cwd: '<%= path.dist %>/javascript/',
                    src: ['*.js', '!*.min.js'],
                    dest: '<%= path.dist %>/javascript/',
                    ext: '.min.js'
                }]
            }
        },

        watch: {
            options: {
                livereload: true,
                spawn: false
            },
            html: {
                files: '<%= path.dev %>/views/**/*.jade',
                tasks: 'jade'
            },
            css: {
                files: '<%= path.dev %>/stylus/**/*.styl',
                tasks: ['stylus', 'csslint']
            },
            javascript: {
                files: ['<%= path.dev %>/javascript/**/*.js', '<%= path.dev %>/javascript/*.js'],
                tasks: ['concat', 'jshint']
            },
            imagemin: {
                files: ['<%= path.dev %>/images/**/*.png', '<%= path.dev %>/images/**/*.jpg', '<%= path.dev %>/images/**/*.gif'],
                tasks: 'imagemin'
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('html', 'jade');
    grunt.registerTask('css', ['stylus', 'csslint', 'cmq', 'cssmin']);
    grunt.registerTask('javascript', ['concat', 'jshint', 'uglify']);
    grunt.registerTask('image', 'imagemin');

    grunt.registerTask('dev', ['browserSync', 'watch']);
    grunt.registerTask('prod', ['html', 'css', 'javascript', 'image']);
};
