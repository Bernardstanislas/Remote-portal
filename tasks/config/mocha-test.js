/**
 * Created by stan on 17/12/14.
 */

module.exports = function(grunt) {
    grunt.config.set('test', {
        test: {
            options: {
                reporter: 'spec'
            },
            src: ['tests/**/*.spec.js']
        }
    });

    grunt.loadNpmTasks('grunt-mocha-test');
};