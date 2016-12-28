/**
 * Created by geminiwen on 14-10-14.
 */

var gulp = require("gulp");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var less = require("gulp-less");
var watch = require("gulp-watch");
var del = require("del");
var coffee = require("gulp-coffee");
var sourcemaps = require('gulp-sourcemaps');

var debug = false;

var file = {
    "javascript": {
        "src": "./static/javascript/src/**/*.js",
        "dist": "./static/javascript/dist"
    },
    "less": {
        "src": [
            'static/less/**/*.less',
            '!static/less/global/**/*.less'
        ],
        "dist": "./static/css"
    },
    "coffee": {
        "src": [
            'static/coffeescript/**/*.coffee'
        ],
        "dist": "./static/javascript/src"
    }
};


gulp.task('less', function () {
    'use strict';
    var source = file.less.src;
    gulp.src(source)
        .pipe(less())
        .pipe(gulp.dest(file.less.dist));

});

gulp.task("coffee", function () {
    'use strict';
    var source = file.coffee.src;
    var dest = file.javascript.dist;
    var stream = gulp.src(source);

    stream.pipe(coffee({bare: true}))
        .pipe(rename({suffix: '.min', extname: ".js"}))
        .pipe(gulp.dest(dest));

});

gulp.task('clean', function () {
    'use strict';
    del([file.javascript.dist + '/*',
        file.less.dist + '/*']);
});

gulp.task('default', ['less', 'coffee']);
gulp.task('debug', function () {
    debug = true;
    console.log("Entering Debug Mode and watching file change");
    gulp.start('default');
});
gulp.task('release', ['default']);