module.exports = function(grunt) {

    grunt.initConfig({
        'jasmine_node': {
            'e2e': { 
                'options': {
                    'specNameMatcher': '.e2e'
                },
                'src' : [ 'test/e2e' ]
            },
            'unit': { 
                'options': {
                    'specNameMatcher': '.ut'
                },
                'src' : [ 'test/unit' ]
            }
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
                    __dirname + '/*.js',
                    __dirname + '/lib/**/*.js',
                    __dirname + '/test/unit/*.js'
                ],
                'tasks' : [ 'jshint', 'jasmine_node:unit' ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-jasmine-node-new');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('test',function(type){
        if (type === 'e2e'){
            grunt.task.run('jshint');
            grunt.task.run('jasmine_node:e2e');
            return;
        }
        grunt.task.run('jshint');
        grunt.task.run('jasmine_node:unit');
    });

};
