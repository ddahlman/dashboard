var gulp = require('gulp');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var cleanCss = require('gulp-clean-css');
var del = require('del');

gulp.task('clean-css', function () {
    return del(['dist/css/*.css']);
});

gulp.task('clean-js', function () {
    return del(['dist/js/*.js']);
});

gulp.task('sass', ['clean-css'], function () {
    return gulp.src('./app/scss/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
        .pipe(sass({ includePaths: './node_modules/' }))
        .pipe(cleanCss())
        .pipe(gulp.dest('dist/css'))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('pack-js', ['clean-js'], function () {
    return gulp.src(['app/js/script.js'])
        .pipe(babel({ presets: ["es2015"] }))
        .pipe(concat('bundle.js'))
        .pipe(minify({ ext: { min: '.js' }, noSource: true }))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('debug', ['clean-js'], function () {
    return gulp.src(['app/js/script.js'])
        .pipe(babel({ presets: ["es2015"] }))
        .pipe(concat('debug.js'))
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('default', ['pack-js', 'debug', 'sass'], function () {
    gulp.watch('./app/scss/**/*.scss', ['sass']);
    gulp.watch('./app/js/**/*.js', ['pack-js', 'debug']);
});