module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({

        //Read the package.json (optional)
        pkg: grunt.file.readJSON('package.json'),

        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> ',

        env: {
            dev: {
                HERO_ENV: 'dev'
            }
        },

        jasmine_node: {
            options: {
                forceExit: true,
                jUnit: {
                    report: true,
                    savePath: "./reports/",
                    useDotNotation: true,
                    consolidate: true
                }
            },
            integration: ['test/integration/'],
            unit: ['test/unit/'],
            all: ['test']
        }

    });

    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-env');

    // Default task.
    grunt.registerTask('default', ['env', 'jasmine_node:unit']);
};
