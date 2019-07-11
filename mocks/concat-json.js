var jsonConcat = require('json-concat');
var watch = require('glob-watcher');


watch(['mocks/data/**/*.json'], function(done){
    jsonConcat({
        src: 'mocks/data/de/',
        dest: 'mocks/data.json',
    }, function(){
        console.log("Successfully merged (german)");
        done();
    });

    jsonConcat({
        src: 'mocks/data/en/',
        dest: 'mocks/data_en.json',
    }, function(){
        console.log("Successfully merged (english)");
        done();
    });
});