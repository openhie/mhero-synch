module.exports = function (config) {
    config.set({
        basePath: '../',

        files: [
            'test/lib/*.js',
            'test/unit/**/*.js'
        ],

        exclude: [],

        autoWatch: true,

        frameworks: ['jasmine'],

        reporters: ['progress', 'junit', 'coverage'],

        coverageReporter: {
            type: 'cobertura',
            dir: 'test/unit/report/coverage'
        },

        junitReporter: {
            outputFile: 'test/unit/report/junit/test-results.xml',
            suite: ''
        },

        browsers: ['PhantomJS'],

        plugins: [
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-coverage',
            'karma-junit-reporter'
        ],

        singleRun: true
    })
};
