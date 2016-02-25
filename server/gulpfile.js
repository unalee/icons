// gulpfile.js
'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var filter = require('gulp-filter');
var jshint = require('gulp-jshint');
var changed = require('gulp-changed');
var addsrc = require('gulp-add-src');
var ngAnnotate = require('gulp-ng-annotate');
var newer = require('gulp-newer');
var notify = require('gulp-notify');
var watch = require('gulp-watch');

var del = require('del');
var mainBowerFiles = require('main-bower-files');
var transform = require('vinyl-transform');

var bower = mainBowerFiles();

var bower = mainBowerFiles({
        checkExistence: true
    });

// Handle the error
function errorHandler (error) {
    console.log(error.toString());
    this.emit('end');
}


if(!bower.length) {
    throw new Error('No main files from Bower dependencies found!');
}
var libs = 'public/js/libs/*.js';

gulp.task('scripts', function () {
    return gulp.src( 
        bower
    )
    .pipe(filter('*.js'))
    // .pipe(addsrc.append('public/app/app.js'))
    // .pipe(addsrc.append('public/app/**/*.js'))
    .pipe(concat('build.js')).on('error', errorHandler)
    // .pipe(ngAnnotate())
    // .pipe(uglify())
    .pipe(gulp.dest('dist/public/app'))
    .pipe(gulp.dest('public/app'))
    .pipe(notify({ message: "JS: Your files are now organized" }));
});

// Compile CSS
var less = require('gulp-less');
var path = require('path');

gulp.task('less', function () {
  return gulp.src('public/assets/less/main.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('public/assets/css/'))
    .pipe(gulp.dest('dist/public/assets/css/'))
    .pipe(browserSync.stream());
});

gulp.task('html', function() {
    return gulp.src(['public/**/*.html'])
      .pipe(gulp.dest('dist/public/partials'));
});

var browserSync = require('browser-sync').create();
var historyApiFallback = require('connect-history-api-fallback')

gulp.task('serve', ['less'], function() {

    browserSync.init({
        server: "./public",
        files: ["./public/*.html", "./public/css/*.css", "./public/app/*.html", "./public/app/pages/*.html"],
        middleware: [require("connect-logger")(), historyApiFallback()]
    });

    gulp.watch('public/assets/less/*.less', ['less']);
    gulp.watch("public/*.html").on('change', browserSync.reload);
});

// Watch files for changes
 gulp.task('watch', function() {
//     gulp.watch('public/js/**/*.js', ['scripts']);
     gulp.watch('public/assets/less/*.less', ['less']);
 });

gulp.task('clean', function(cb) {
    del(['dist/public/assets/css/', 'dist/public/js/', 'dist/public/partials/'], cb);
});

gulp.task('default', ['clean'], function() {
    gulp.start('less', 'html', 'scripts').on('error', errorHandler);
});