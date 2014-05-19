module.exports = function (grunt) {
  // Project configuration
  grunt.initConfig({
    clean: {
      release: ["release"]
    },
    // Task configuration
    jshint: {
      options: {
        scripturl: true,
        evil: true,
        expr: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        //unused: true,
        boss: true,
        eqnull: true,
        globals: {
          "console": true,
          "exports": true,
          "require": true,
          "module": true,
          "define": true,
          "_": true,
          "sinon": true,
          "describe": true,
          "before": true,
          "it": true,
          "beforeEach": true,
          "$": true,
          "Backbone": true,
          "window": true,
          "process": true
        }
      },

      gruntfile: {
        src: ["gruntfile.js"]
      },

      kubu: {
        src: ['tasks/**/*.js', 'app/**/*.js', 'tests/**/*.js']
      }
    },

    watch: {
      all: {
        files: ['app/**/*.js', 'tests/**/*.js', 'Gruntfile.js', 'assets/**/*.less' ] ,
        tasks: ['dev']
      },
    },

    less:{
      development: {
        options: {
          paths: ["assets/css"]
        },
        files: {
          "assets/css/index.css": "assets/less/index.less"
        }
      }
     },

     couchserver: {
       defaults: {
          dist: './dist/debug/',
          port: 8001,
          proxy: {
            target: {
              host: 'localhost',
              port: 5984,
              https: false
            },
            // This sets the Host header in the proxy so that you can use external
            // CouchDB instances and not have the Host set to 'localhost'
            changeOrigin: true
          }
         }
     },

     shell: {
        deployLocal: {
            command: './node_modules/couchapp/bin.js push couchapp.js ' + process.env.COUCHDB + '/babylist',
            options: {                      // Options
                stdout: true
            }
        },

        deployCloudant: {
            command: './node_modules/couchapp/bin.js push couchapp.js '+ process.env.CLOUDANT +'/babylist',
            options: {                      // Options
                stdout: true
            }

        }
     },

    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: [
          'assets/js/libs/d3.js',
          'assets/js/libs/d3.tip.js',
          'assets/js/libs/jquery.js',
          'assets/js/libs/lodash.js',
          'assets/js/libs/backbone.js',

          'app/charts.js',
          'app/main.js'
          ],
        dest: 'dist/app.js',
      },
    }

  });

  // These plugins provide necessary tasks
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.registerTask('dev', ['debug', 'couchserver']);

  grunt.loadTasks('tasks');

  // Default task
  grunt.registerTask('dev', ['clean', 'jshint','concat:dist', 'less']);
  grunt.registerTask('default', ['dev', 'couchserver']);
  grunt.registerTask('release', ['clean', 'jshint', 'less', 'concat', 'shell:deployCloudant' ]);
};



