// Generated by CoffeeScript 1.9.2
(function() {
  module.exports = function(grunt) {
    grunt.initConfig({
        nodemon: {
            dev: {
                script: "app.js",
                options: {
                    ext: "js",
                    debug: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-nodemon');
        return grunt.registerTask('default', ['nodemon']);
    };

}).call(this);