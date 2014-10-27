module.exports = function(grunt) {

    grunt.initConfig({
        'jasmine_node': {
            'options': {
                'specNameMatcher': '.ut'
            },
            all: ['test/unit']
        },
        'jshint': {
            'options' : {
                'jshintrc': 'jshint.json'
            },
            'all': [
                __dirname + '/bin/{,*/}*.js',
                __dirname + '/lib/{,*/}*.js',
                __dirname + 'index.js',
                __filename
            ]
        },
        'watch': {
            'test': {
                'options': {
                    atBegin : true
                },
                'files': [
                    __dirname + '/lib/**/*.js',
                    __dirname + '/test/**/*.js'
                ],
                'tasks' : [ 'jshint', 'jasmine_node' ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('test',function(){
        grunt.task.run('jshint');
        grunt.task.run('jasmine_node');
    });

};
