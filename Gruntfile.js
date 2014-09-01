module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({

        //Read the package.json (optional)
        pkg: grunt.file.readJSON('package.json'),

        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> ',

        karma: {
            unit: {
                configFile: 'config/karma.conf.js'
            }
        }

    });

    grunt.loadNpmTasks('grunt-karma');


    // Default task.
    grunt.registerTask('default', ['karma:unit']);
};
