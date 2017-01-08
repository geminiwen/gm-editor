/**
 * Created by geminiwen on 14-10-14.
 */

'use strict';

var gulp = require("gulp");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var less = require("gulp-less");
var del = require("del");
var coffee = require("gulp-coffee");
var sourcemaps = require('gulp-sourcemaps');
var electron = require('electron-connect').server.create()

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
    return gulp.src(file.less.src)
        .pipe(less())
        .pipe(gulp.dest(file.less.dist));

});

gulp.task("coffee", function () {
    return gulp.src(file.coffee.src)
        .pipe(coffee({bare: true}))
        .pipe(rename({suffix: '.min', extname: ".js"}))
        .pipe(gulp.dest(file.javascript.dist));

});

gulp.task('clean', function () {
    'use strict';
    del([file.javascript.dist + '/*',
        file.less.dist + '/*']);
});
gulp.task('watch', ['less', 'coffee'], function () {
    electron.start()

    gulp.watch([file.coffee.src], ['coffee'], electron.reload);
    gulp.watch([file.less.src], ['less'], electron.reload);
    gulp.watch('index.html', electron.reload);

});
gulp.task('default', ['watch']);
gulp.task('release', ['default']);